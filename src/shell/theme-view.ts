import { newAdapter } from "@repo/shared-adapters";
import { BaseClass } from "@repo/shared-baseclass";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Reactive model for the application theme.
 * Tracks the user's preference (light / dark / system).
 * The resolved theme reflects the actual applied theme,
 * accounting for system preference when mode is "system".
 */
export class ThemeView extends BaseClass {
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

export const [getThemeView] = newAdapter<ThemeView>(
  "model:theme",
  () => new ThemeView(),
);
