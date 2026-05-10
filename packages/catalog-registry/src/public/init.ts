import { newRegistry } from "@statewalker/shared-registry";

/**
 * No-op fragment init: `json:catalogs` is a slot key declared in
 * `catalog-registry.ts`; consumers reach it via
 * `newCatalogRegistry(workspace)` (logic side) or `useCatalogRegistry()`
 * from `@statewalker/catalog-registry-react` (renderer side) without
 * eager adapter instantiation.
 */
export default function initCatalogRegistry(_ctx: Record<string, unknown>): () => Promise<void> {
  const [, cleanup] = newRegistry();
  return cleanup;
}
