import { newRegistry } from "@statewalker/shared-registry";

/**
 * No-op fragment init: `json:catalogs` is a slot key declared in
 * `catalog-registry.ts`; consumers reach it via
 * `newCatalogRegistry(workspace)` / `useCatalogRegistry()` without
 * eager adapter instantiation. Kept as a placeholder so the combined
 * `json-render/fragment.ts` can register both catalog-registry and
 * spec-store inits side-by-side.
 */
export default function initCatalogRegistry(
  _ctx: Record<string, unknown>,
): () => Promise<void> {
  const [, cleanup] = newRegistry();
  return cleanup;
}
