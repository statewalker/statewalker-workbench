import { newRegistry } from "@statewalker/shared-registry";

/**
 * No-op renderer-fragment init: `catalogsSlot` is consumed via
 * `useKeyedSlot(slots, catalogsSlot)`, not an adapter that needs eager
 * setup. Kept so the package conforms to the canonical fragment shape.
 */
export default function initCatalogRegistryReact(
  _ctx: Record<string, unknown>,
): () => Promise<void> {
  const [, cleanup] = newRegistry();
  return cleanup;
}
