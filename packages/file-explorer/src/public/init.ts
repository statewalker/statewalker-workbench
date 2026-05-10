import { newRegistry } from "@statewalker/shared-registry";

/**
 * Logic-fragment init for `@statewalker/file-explorer`.
 *
 * The file-explorer is structured around per-panel orchestration
 * (`PanelController`) rather than a workspace-scoped singleton: the
 * renderer constructs one panel per dock contribution. This `init`
 * therefore has no workspace-scoped subscriptions — it exists only
 * so apps can register the package alongside the rest of the
 * substrate fragments.
 *
 * Per ADR 0002 (logic-only): no React imports.
 */
export default function initFileExplorer(_ctx: Record<string, unknown>): () => Promise<void> {
  const [_register, cleanup] = newRegistry();
  return cleanup;
}
