import { newAdapter } from "@statewalker/shared-adapters";
import { BaseClass } from "@statewalker/shared-baseclass";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Theme token — workspace-scoped application-theme model. Apps reach the
 * workspace-scoped instance via `workspace.requireAdapter(Theme)`; the
 * workspace's adapter system accepts any plain class, so this token does
 * not need to import or implement `WorkspaceAdapter`. Tracks the user's
 * preference (light / dark / system) and the resolved theme; the DOM
 * binding subscribes to `onUpdate` and pushes the resolved theme back via
 * `setResolved`.
 */
export class Theme extends BaseClass {
  private _mode: ThemeMode = "system";
  private _resolved: "light" | "dark" = "dark";

  get mode(): ThemeMode {
    return this._mode;
  }

  get resolved(): "light" | "dark" {
    return this._resolved;
  }

  get isDark(): boolean {
    return this._resolved === "dark";
  }

  get isLight(): boolean {
    return this._resolved === "light";
  }

  get isSystem(): boolean {
    return this._mode === "system";
  }

  setMode(mode: ThemeMode): void {
    if (this._mode === mode) return;
    this._mode = mode;
    this.notify();
  }

  /** Called by the DOM binding to update the resolved theme. */
  setResolved(resolved: "light" | "dark"): void {
    if (this._resolved === resolved) return;
    this._resolved = resolved;
    this.notify();
  }

  /** Toggle between light and dark (skips system). */
  toggle(): void {
    this.setMode(this.isDark ? "light" : "dark");
  }
}

export { Theme as ThemeView };

export const [getThemeView] = newAdapter<Theme>("model:theme", () => new Theme());
