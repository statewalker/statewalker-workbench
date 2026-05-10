import { KeyedSlot, Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace-api";
import type { ComponentType } from "react";

/**
 * Slot key declared by `inline-content` carrying React components for
 * inline-content rendering, keyed by component name. Replaces the
 * retired `InlineContentRegistry` adapter (per ADR 0006 + the
 * `late-binding-primitives` capability spec).
 *
 * Renderer-side contributions live in `@statewalker/inline-content-react`
 * (which depends on this package). Logic-side declarations of inline
 * components live in `inline-content:components`.
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
export function newInlineContentRegistry(
  workspace: Workspace,
): KeyedSlot<InlineContentComponent> {
  return new KeyedSlot<InlineContentComponent>(
    workspace.requireAdapter(Slots),
    INLINE_CONTENT_RENDERERS_SLOT_KEY,
  );
}
