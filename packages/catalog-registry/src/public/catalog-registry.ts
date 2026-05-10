import { defineKeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace";

/**
 * Keyed slot carrying json-render registries (the value returned by
 * `defineRegistry(...).registry`) keyed by stable `catalogId`. The
 * value is held opaquely because the registry's runtime types live
 * at the rendering boundary, not in this slot's surface.
 *
 * Use the workspace's `Slots` adapter to register / look up:
 *
 *   slots.register(catalogsSlot, "chat", chatRegistry);
 *   const reg = slots.get(catalogsSlot, "chat");
 */
export const catalogsSlot = defineKeyedSlot<unknown>("json:catalogs");

/**
 * Convenience: returns a write-capable view of `catalogsSlot` bound
 * to the workspace's `Slots` adapter. Use from logic-side init code
 * that registers a catalog by id.
 */
export function newCatalogRegistry(workspace: Workspace): {
  register(id: string, registry: unknown): () => void;
  get(id: string): unknown | null;
} {
  const slots = workspace.requireAdapter(Slots);
  return {
    register: (id, registry) => slots.register(catalogsSlot, id, registry),
    get: (id) => slots.get(catalogsSlot, id),
  };
}
