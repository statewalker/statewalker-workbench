import { defineKeyedSlot } from "@statewalker/shared-slots";

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
