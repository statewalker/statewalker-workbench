import { newRegistry } from "@statewalker/shared-registry";

/**
 * Logic-fragment init for `inline-content`. The `inline-content:*`
 * slot keys are pure data declarations exported from the package's
 * public surface; init is a no-op now that the
 * `InlineContentRegistry` adapter has been retired in favour of
 * `KeyedSlot<InlineContentComponent>` over the
 * `inline-content:renderers` slot.
 */
export default function initInlineContent(
  _ctx: Record<string, unknown>,
): () => Promise<void> {
  const [, cleanup] = newRegistry();
  return cleanup;
}
