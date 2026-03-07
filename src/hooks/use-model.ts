import { useEffect, useState } from "react";

/**
 * Subscribes to one or more observable callbacks and forces a re-render
 * whenever any of them fires.
 *
 * Each callback must follow the `onUpdate` convention: accept a listener
 * function and return an unsubscribe function.
 *
 * @example
 * ```tsx
 * function CounterView({ model }: { model: TestPanelModel }) {
 *   useUpdates(model.onUpdate);
 *   return <span>{model.counter}</span>;
 * }
 * ```
 *
 * For multiple observables (e.g. model + nested action):
 * ```tsx
 * useUpdates(model.onUpdate, model.action.onUpdate);
 * ```
 */
export function useUpdates(
  ...callbacks: ((notify: () => void) => () => void)[]
): void {
  const [, redraw] = useState({});
  useEffect(() => {
    const notify = () => redraw({});
    const cleanups = callbacks.map((cb) => cb(notify));
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  }, callbacks); // eslint-disable-line react-hooks/exhaustive-deps
}
