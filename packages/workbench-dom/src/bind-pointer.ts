import { getPointerInteractionView } from "@statewalker/workbench-views";

/**
 * Binds DOM pointer events to the PointerInteractionView model.
 * Returns a cleanup function that removes the listeners.
 */
export function bindPointer(
  ctx: Record<string, unknown>,
  target: HTMLElement = document.documentElement,
): () => void {
  const pointer = getPointerInteractionView(ctx);

  function handleClick(e: MouseEvent): void {
    pointer.click(e.clientX, e.clientY);
  }

  function handleDblClick(e: MouseEvent): void {
    pointer.doubleClick(e.clientX, e.clientY);
  }

  target.addEventListener("click", handleClick);
  target.addEventListener("dblclick", handleDblClick);
  return () => {
    target.removeEventListener("click", handleClick);
    target.removeEventListener("dblclick", handleDblClick);
  };
}
