import { getKeyboardInteractionView, getKeyboardView } from "@statewalker/shared-views";

/**
 * Binds the DOM keydown listener to both interaction models:
 * - KeyboardInteractionView: receives raw key presses
 * - KeyboardView: dispatches registered key bindings
 *
 * Returns a cleanup function that removes the listener.
 */
export function bindKeyboard(ctx: Record<string, unknown>): () => void {
  const interaction = getKeyboardInteractionView(ctx);
  const bindings = getKeyboardView(ctx);

  function handleKeyDown(e: KeyboardEvent): void {
    // Skip form elements
    const tag = (document.activeElement as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    // Skip when dialog is open
    if (document.querySelector("[role=dialog]")) return;

    // Build key combo: "Ctrl+Shift+F3", "ArrowDown", etc.
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
    if (e.shiftKey) parts.push("Shift");
    if (e.altKey) parts.push("Alt");
    parts.push(e.key);
    const combo = parts.length > 1 ? parts.join("+") : e.key;

    // Write to raw interaction model
    interaction.pressKey(combo);

    // Dispatch registered key bindings
    const matched =
      bindings.getBindings(combo).length > 0
        ? bindings.getBindings(combo)
        : bindings.getBindings(e.key);

    for (const binding of matched) {
      if (binding.preventDefault !== false) {
        e.preventDefault();
      }
      binding.execute();
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}
