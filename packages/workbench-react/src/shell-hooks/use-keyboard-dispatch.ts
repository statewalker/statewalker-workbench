import { useEffect } from "react";

export function useKeyboardDispatch(
  getBindings: () => Map<string, () => void>,
  options?: { skip?: () => boolean },
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (options?.skip?.()) return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (document.querySelector("[role=dialog]")) return;

      const bindings = getBindings();
      const handler = bindings.get(e.key);
      if (handler) {
        e.preventDefault();
        handler();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getBindings, options]);
}
