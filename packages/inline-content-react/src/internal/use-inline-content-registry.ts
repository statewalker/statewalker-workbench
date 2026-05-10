import { type KeyedSlotView, useAdapter, useKeyedSlot } from "@statewalker/core-react";
import { Slots } from "@statewalker/shared-slots";
import {
  type InlineContentComponent,
  inlineContentRenderersSlot,
} from "../public/inline-content-registry.js";

/**
 * React hook returning a reactive view of `inlineContentRenderersSlot`
 * bound to the application's `Slots` adapter. Read-only; logic-side
 * registration goes through
 * `slots.register(inlineContentRenderersSlot, name, component)`.
 */
export function useInlineContentRegistry(): KeyedSlotView<InlineContentComponent> {
  const slots = useAdapter(Slots);
  return useKeyedSlot(slots, inlineContentRenderersSlot);
}
