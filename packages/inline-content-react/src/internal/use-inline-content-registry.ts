import { useAdapter, useKeyedSlot } from "@statewalker/core-react";
import type { KeyedSlot } from "@statewalker/shared-slots";
import { Slots } from "@statewalker/shared-slots";
import {
  INLINE_CONTENT_RENDERERS_SLOT_KEY,
  type InlineContentComponent,
} from "../public/inline-content-registry.js";

/**
 * React hook returning the `KeyedSlot<InlineContentComponent>` bound to
 * the application's `Slots` adapter under `inline-content:renderers`.
 */
export function useInlineContentRegistry(): KeyedSlot<InlineContentComponent> {
  const slots = useAdapter(Slots);
  return useKeyedSlot<InlineContentComponent>(slots, INLINE_CONTENT_RENDERERS_SLOT_KEY);
}
