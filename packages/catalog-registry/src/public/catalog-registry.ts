import { KeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace";

/**
 * Slot key carrying json-render registries (the value returned by
 * `defineRegistry(...).registry`) keyed by stable `catalogId`.
 * Replaces the retired `CatalogRegistry` adapter (per ADR 0006 + the
 * `late-binding-primitives` capability spec).
 */
export const JSON_CATALOGS_SLOT_KEY = "json:catalogs";

/**
 * Construct a `KeyedSlot<unknown>` over the workspace's `Slots`
 * adapter under `json:catalogs`. The value is held opaquely because
 * the registry's runtime types live at the rendering boundary, not
 * in this slot's surface.
 *
 * Use from logic-side init code that registers a catalog by id.
 * Renderer-side consumers should use `useCatalogRegistry()` from
 * `@statewalker/catalog-registry-react`.
 */
export function newCatalogRegistry(workspace: Workspace): KeyedSlot<unknown> {
  return new KeyedSlot<unknown>(workspace.requireAdapter(Slots), JSON_CATALOGS_SLOT_KEY);
}
