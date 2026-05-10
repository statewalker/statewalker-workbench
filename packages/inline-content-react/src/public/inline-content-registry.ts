import { KeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace";
import type { ComponentType } from "react";

/**
 * Slot key carrying React components for inline-content rendering, keyed
 * by component name. Owned by the renderer-side fragment because the
 * slot value is React-typed; the logic-side `@statewalker/inline-content`
 * fragment owns only the framework-neutral `inline-content:components`
 * descriptor slot.
 */
export const INLINE_CONTENT_RENDERERS_SLOT_KEY = "inline-content:renderers";

/**
 * Generic shape of an inline-content component. Concrete components
 * cast `props` to their specific shape internally; the slot holds
 * them opaquely.
 */
export type InlineContentComponent = ComponentType<{ props: unknown }>;

/**
 * Construct a `KeyedSlot<InlineContentComponent>` over the workspace's
 * `Slots` adapter under `inline-content:renderers`.
 */
export function newInlineContentRegistry(workspace: Workspace): KeyedSlot<InlineContentComponent> {
  return new KeyedSlot<InlineContentComponent>(
    workspace.requireAdapter(Slots),
    INLINE_CONTENT_RENDERERS_SLOT_KEY,
  );
}
