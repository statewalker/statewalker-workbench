import { JSON_CATALOGS_SLOT_KEY } from "@statewalker/catalog-registry";
import { useAdapter, useKeyedSlot } from "@statewalker/core-react";
import { type KeyedSlot, Slots } from "@statewalker/shared-slots";

/**
 * React hook returning a `KeyedSlot<unknown>` bound to the
 * application's `Slots` adapter under `json:catalogs`. Pairs with
 * `newCatalogRegistry(workspace)` from `@statewalker/catalog-registry`.
 */
export function useCatalogRegistry(): KeyedSlot<unknown> {
  const slots = useAdapter(Slots);
  return useKeyedSlot<unknown>(slots, JSON_CATALOGS_SLOT_KEY);
}
