import { useAdapter, useKeyedSlot } from "@statewalker/core-react";
import {
  INLINE_CONTENT_RENDERERS_SLOT_KEY,
  type InlineContentComponent,
} from "@statewalker/inline-content";
import type { KeyedSlot } from "@statewalker/shared-slots";
import { Slots } from "@statewalker/shared-slots";

/**
 * React hook returning the `KeyedSlot<InlineContentComponent>` bound to
 * the application's `Slots` adapter under `inline-content:renderers`.
 * Lives here (renderer-side) because `inline-content` is logic-only
 * and cannot depend on `core-react`.
 */
export function useInlineContentRegistry(): KeyedSlot<InlineContentComponent> {
  const slots = useAdapter(Slots);
  return useKeyedSlot<InlineContentComponent>(slots, INLINE_CONTENT_RENDERERS_SLOT_KEY);
}
