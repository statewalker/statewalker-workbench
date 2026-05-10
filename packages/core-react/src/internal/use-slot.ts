import { getSlotKey, KeyedSlot, type SlotObserve, type Slots } from "@statewalker/shared-slots";
import { useMemo, useSyncExternalStore } from "react";

/**
 * React hook: subscribe to a slot's contributions on the given `Slots` bus.
 *
 * Pass the typed `observe` function returned by `newSlot`; the hook reads
 * the slot key off the function so callers do not have to pass it twice.
 * Returns a referentially-stable readonly array — the same reference is
 * returned across renders unless the slot mutated, so
 * `useSyncExternalStore` does not loop.
 *
 * Migrated from `@statewalker/shared-slots/react` per ADR 0007 (substrate
 * stays framework-free).
 */
export function useSlot<T>(slots: Slots, observe: SlotObserve<T>): readonly T[] {
  const key = getSlotKey(observe);
  if (!key) {
    throw new Error(
      "useSlot: the observe function was not produced by newSlot(...). " +
        "useSlot only works with typed slot observers because it needs the " +
        "slot key to read a stable getSnapshot() reference.",
    );
  }
  return useSyncExternalStore(
    (notify) => observe(slots, () => notify()),
    () => slots.getSnapshot<T>(key),
  );
}

/**
 * React hook: subscribe to a `KeyedSlot<T>` over a given slot key.
 *
 * Returns the wrapper itself; consumers call `.get(id)` to look up
 * contributions in O(1). Re-renders whenever the underlying slot's
 * contributions for that key change (the wrapper's `version` counter
 * drives `useSyncExternalStore`).
 *
 * The wrapper instance is memoised per `(slots, slotKey)` pair so consumers
 * can rely on referential stability across renders.
 */
export function useKeyedSlot<T>(slots: Slots, slotKey: string): KeyedSlot<T> {
  const wrapper = useMemo(() => new KeyedSlot<T>(slots, slotKey), [slots, slotKey]);
  useSyncExternalStore(
    (notify) => wrapper.observe(() => notify()),
    () => wrapper.version,
    () => wrapper.version,
  );
  return wrapper;
}
