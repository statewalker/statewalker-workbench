import { KeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace-api";
import type { ComponentType } from "react";
import { useAdapter } from "../internal/use-adapter.js";
import { useKeyedSlot } from "../internal/use-slot.js";

/**
 * Slot key declared by `core-react` carrying React components by
 * stable `viewKey`. Replaces the retired `ViewRegistry` adapter (per
 * ADR 0006 + the `late-binding-primitives` capability spec).
 *
 * ViewKey naming convention: `<owning-logic-fragment-id>:<purpose>` —
 * e.g. `chat:turn-block:tool-call`, `providers:model-picker`.
 */
export const CORE_VIEWS_SLOT_KEY = "core:views";

/**
 * Generic shape of a view component registered in the `core:views`
 * slot. Concrete components may take richer prop types; the slot
 * holds them opaquely (consumers cast at usage time, the same way
 * the `json:catalogs` slot holds json-render registries opaquely).
 */
export type ViewComponent = ComponentType<unknown>;

/**
 * Construct a `KeyedSlot<ViewComponent>` over the workspace's `Slots`
 * adapter under `core:views`. Use from logic-side init code that
 * registers React components by viewKey.
 *
 * Semantics are identical to the retired `ViewRegistry`:
 * collision-throw on duplicate ids with different components, no-op on
 * same-reference re-registration, O(1) `get(id)`.
 */
export function newViewRegistry(workspace: Workspace): KeyedSlot<ViewComponent> {
  return new KeyedSlot<ViewComponent>(workspace.requireAdapter(Slots), CORE_VIEWS_SLOT_KEY);
}

/**
 * React hook returning a `KeyedSlot<ViewComponent>` bound to the
 * application's `Slots` adapter under `core:views`. Re-renders on
 * every contribution change.
 */
export function useViewRegistry(): KeyedSlot<ViewComponent> {
  const slots = useAdapter(Slots);
  return useKeyedSlot<ViewComponent>(slots, CORE_VIEWS_SLOT_KEY);
}
