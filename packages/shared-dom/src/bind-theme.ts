import { newRegistry } from "@statewalker/shared-registry";
import { type ThemeMode, getThemeView } from "@statewalker/shared-views";

const STORAGE_KEY = "theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? getSystemTheme() : mode;
}

function loadStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "system";
}

function applyTheme(resolved: "light" | "dark"): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

/**
 * Binds the ThemeView model to the DOM:
 * - Initializes from localStorage or defaults to "system"
 * - Applies CSS class on document.documentElement
 * - Persists changes to localStorage
 * - Listens for system preference changes when mode is "system"
 *
 * Returns a cleanup function.
 */
export function bindTheme(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();
  const theme = getThemeView(ctx);

  // Initialize from stored preference or system default
  const storedMode = loadStoredMode();
  const resolved = resolveTheme(storedMode);
  theme.setMode(storedMode);
  theme.setResolved(resolved);
  applyTheme(resolved);

  // Listen for model changes → resolve, apply CSS, persist
  register(
    theme.onUpdate(() => {
      const next = resolveTheme(theme.mode);
      theme.setResolved(next);
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, theme.mode);
      } catch {
        // localStorage unavailable
      }
    }),
  );

  // Listen for system preference changes (relevant when mode is "system")
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  function onSystemChange(): void {
    if (theme.isSystem) {
      const next = getSystemTheme();
      theme.setResolved(next);
      applyTheme(next);
    }
  }
  mediaQuery.addEventListener("change", onSystemChange);
  register(() => mediaQuery.removeEventListener("change", onSystemChange));

  return cleanup;
}
