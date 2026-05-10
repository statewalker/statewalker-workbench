import { catalogsSlot } from "@statewalker/catalog-registry";
import { useAdapter, useKeyedSlot, type KeyedSlotView } from "@statewalker/core-react";
import { Slots } from "@statewalker/shared-slots";

/**
 * React hook returning a reactive view of `catalogsSlot` bound to the
 * application's `Slots` adapter. Read-only; logic-side registration
 * goes through `slots.register(catalogsSlot, id, registry)`.
 */
export function useCatalogRegistry(): KeyedSlotView<unknown> {
  const slots = useAdapter(Slots);
  return useKeyedSlot(slots, catalogsSlot);
}
