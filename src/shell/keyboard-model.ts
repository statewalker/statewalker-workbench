import { newAdapter } from "@repo/shared/adapters";
import { BaseClass } from "@repo/shared/models";

export interface KeyBinding {
  /** Key or combo, e.g. "F3", "ArrowUp", "Ctrl+H" */
  key: string;
  /** Callback to execute when the key is pressed */
  execute: () => void;
  /** If true, calls e.preventDefault() before executing */
  preventDefault?: boolean;
}

/**
 * A registry of keyboard bindings.
 * Apps add bindings when their panels become active and remove them
 * when deactivated. The shared UI layer listens to this model and
 * manages the actual DOM keydown listener.
 */
export class KeyboardModel extends BaseClass {
  private _bindings = new Map<string, KeyBinding[]>();

  /**
   * Register a key binding. Returns a cleanup function that removes it.
   */
  bind(binding: KeyBinding): () => void {
    const { key } = binding;
    let list = this._bindings.get(key);
    if (!list) {
      list = [];
      this._bindings.set(key, list);
    }
    list.push(binding);
    this.notify();

    return () => {
      const l = this._bindings.get(key);
      if (l) {
        const idx = l.indexOf(binding);
        if (idx >= 0) l.splice(idx, 1);
        if (l.length === 0) this._bindings.delete(key);
      }
      this.notify();
    };
  }

  /**
   * Register multiple bindings at once. Returns a single cleanup function.
   */
  bindAll(bindings: KeyBinding[]): () => void {
    const cleanups = bindings.map((b) => this.bind(b));
    return () => {
      for (const c of cleanups) c();
    };
  }

  /**
   * Get all bindings for a key. Returns empty array if none.
   */
  getBindings(key: string): KeyBinding[] {
    return this._bindings.get(key) ?? [];
  }

  /**
   * Whether any bindings are registered.
   */
  get hasBindings(): boolean {
    return this._bindings.size > 0;
  }
}

export const [getKeyboardModel] = newAdapter<KeyboardModel>(
  "model:keyboard",
  () => new KeyboardModel(),
);
