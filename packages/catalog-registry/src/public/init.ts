import { newRegistry } from "@statewalker/shared-registry";

/**
 * No-op fragment init: `json:catalogs` is a slot key declared in
 * `catalog-registry.ts`; consumers reach it directly through the
 * `Slots` adapter — logic side via `slots.register(catalogsSlot, ...)`,
 * renderer side via `useKeyedSlot(slots, catalogsSlot)` — without
 * eager adapter instantiation.
 */
export default function initCatalogRegistry(_ctx: Record<string, unknown>): () => Promise<void> {
  const [, cleanup] = newRegistry();
  return cleanup;
}
