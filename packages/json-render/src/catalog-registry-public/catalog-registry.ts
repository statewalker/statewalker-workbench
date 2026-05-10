import { useAdapter, useKeyedSlot } from "@statewalker/core-react";
import { KeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace-api";

/**
 * Slot key declared by `json-render` carrying json-render registries
 * (the value returned by `defineRegistry(...).registry`) keyed by
 * stable `catalogId`. Replaces the retired `CatalogRegistry` adapter
 * (per ADR 0006 + the `late-binding-primitives` capability spec).
 */
export const JSON_CATALOGS_SLOT_KEY = "json:catalogs";

/**
 * Construct a `KeyedSlot<unknown>` over the workspace's `Slots`
 * adapter under `json:catalogs`. The value is held opaquely because
 * json-render's types stay at the rendering boundary, not in this
 * slot's surface.
 *
 * Use from logic-side init code that registers a catalog by id.
 */
export function newCatalogRegistry(workspace: Workspace): KeyedSlot<unknown> {
  return new KeyedSlot<unknown>(workspace.requireAdapter(Slots), JSON_CATALOGS_SLOT_KEY);
}

/**
 * React hook returning a `KeyedSlot<unknown>` bound to the
 * application's `Slots` adapter under `json:catalogs`.
 */
export function useCatalogRegistry(): KeyedSlot<unknown> {
  const slots = useAdapter(Slots);
  return useKeyedSlot<unknown>(slots, JSON_CATALOGS_SLOT_KEY);
}
