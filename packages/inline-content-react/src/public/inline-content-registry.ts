import { defineKeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace";
import type { ComponentType } from "react";

/**
 * Generic shape of an inline-content component. Concrete components
 * cast `props` to their specific shape internally; the slot holds
 * them opaquely.
 */
export type InlineContentComponent = ComponentType<{ props: unknown }>;

/**
 * Keyed slot carrying React components for inline-content rendering,
 * keyed by component name. Owned by the renderer-side fragment
 * because the slot value is React-typed; the logic-side
 * `@statewalker/inline-content` fragment owns only the
 * framework-neutral `inline-content:components` descriptor slot.
 *
 * Use the workspace's `Slots` adapter to register / look up:
 *
 *   slots.register(inlineContentRenderersSlot, "MyInline", MyInline);
 *   const View = slots.get(inlineContentRenderersSlot, "MyInline");
 */
export const inlineContentRenderersSlot = defineKeyedSlot<InlineContentComponent>(
  "inline-content:renderers",
);

/**
 * Convenience: returns a write-capable view of
 * `inlineContentRenderersSlot` bound to the workspace's `Slots`
 * adapter. Use from renderer-fragment init code that registers
 * inline-content components by name.
 */
export function newInlineContentRegistry(workspace: Workspace): {
  register(id: string, component: InlineContentComponent): () => void;
  get(id: string): InlineContentComponent | null;
} {
  const slots = workspace.requireAdapter(Slots);
  return {
    register: (id, component) => slots.register(inlineContentRenderersSlot, id, component),
    get: (id) => slots.get(inlineContentRenderersSlot, id),
  };
}
