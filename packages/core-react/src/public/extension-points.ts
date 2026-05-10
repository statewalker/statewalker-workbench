import { defineKeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace";
import type { ComponentType } from "react";
import { useAdapter } from "../internal/use-adapter.js";
import { type KeyedSlotView, useKeyedSlot } from "../internal/use-slot.js";

/**
 * Generic shape of a view component registered in the `core:views`
 * slot. Concrete components may take richer prop types; the slot
 * holds them opaquely (consumers cast at usage time).
 */
export type ViewComponent = ComponentType<unknown>;

/**
 * The id-keyed slot carrying React components by stable `viewKey`.
 * Renderer fragments register their components here; logic fragments
 * reference viewKeys as data and resolve to components at render time
 * via `useKeyedSlot(slots, coreViewsSlot)`.
 *
 * ViewKey naming convention: `<owning-logic-fragment-id>:<purpose>` —
 * e.g. `chat:turn-block:tool-call`, `providers:model-picker`.
 */
export const coreViewsSlot = defineKeyedSlot<ViewComponent>("core:views");

/**
 * Convenience: returns a write-capable view of `coreViewsSlot` bound
 * to the workspace's `Slots` adapter. Use from logic-side init code
 * that registers React components by viewKey.
 */
export function newViewRegistry(workspace: Workspace): {
  register(id: string, view: ViewComponent): () => void;
  get(id: string): ViewComponent | null;
} {
  const slots = workspace.requireAdapter(Slots);
  return {
    register: (id, view) => slots.register(coreViewsSlot, id, view),
    get: (id) => slots.get(coreViewsSlot, id),
  };
}

/**
 * React hook: returns a reactive view of `coreViewsSlot` bound to the
 * application's `Slots` adapter. Re-renders on every contribution
 * change. Read-only; logic-side registration goes through
 * `newViewRegistry(workspace)`.
 */
export function useViewRegistry(): KeyedSlotView<ViewComponent> {
  const slots = useAdapter(Slots);
  return useKeyedSlot(slots, coreViewsSlot);
}
