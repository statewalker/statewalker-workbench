import { newAdapter } from "@statewalker/shared-adapters";
import { BaseClass } from "@statewalker/shared-baseclass";

export interface KeyBinding {
  /** Key or combo, e.g. "F3", "ArrowUp", "Ctrl+H" */
  key: string;
  /** Callback to execute when the key is pressed */
  execute: () => void;
  /** If true, calls e.preventDefault() before executing */
  preventDefault?: boolean;
}

/**
 * Keyboard token — collapses today's keyboard registry and the latest-key
 * interaction state into one class. Apps reach the workspace-scoped instance
 * via `workspace.requireAdapter(Keyboard)`; the workspace's adapter system
 * accepts any plain class, so this token does not need to import or implement
 * `WorkspaceAdapter`. The shared UI layer (or app code) drives `pressKey`
 * from real DOM events; controllers register handlers via `bind` / `bindAll`.
 */
export class Keyboard extends BaseClass {
  private _bindings = new Map<string, KeyBinding[]>();
  /** Latest pressed key — last value passed to `pressKey`. */
  key = "";

  bind(binding: KeyBinding): () => void {
    let list = this._bindings.get(binding.key);
    if (!list) {
      list = [];
      this._bindings.set(binding.key, list);
    }
    list.push(binding);
    this.notify();

    return () => {
      const l = this._bindings.get(binding.key);
      if (!l) return;
      const idx = l.indexOf(binding);
      if (idx >= 0) l.splice(idx, 1);
      if (l.length === 0) this._bindings.delete(binding.key);
      this.notify();
    };
  }

  bindAll(bindings: KeyBinding[]): () => void {
    const cleanups = bindings.map((b) => this.bind(b));
    return () => {
      for (const c of cleanups) c();
    };
  }

  getBindings(key: string): KeyBinding[] {
    return this._bindings.get(key) ?? [];
  }

  get hasBindings(): boolean {
    return this._bindings.size > 0;
  }

  /** Run every handler registered for `key`. */
  fire(key: string): void {
    const list = this._bindings.get(key);
    if (!list) return;
    for (const b of list) b.execute();
  }

  pressKey(key: string): void {
    this.key = key;
    this.notify();
  }
}

export { Keyboard as KeyboardView };

export const [getKeyboardView, setKeyboardView] = newAdapter<Keyboard>(
  "model:keyboard",
  () => new Keyboard(),
);
