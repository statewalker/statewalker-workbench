import { handleOpen, runVisualizeFile } from "@statewalker/files";
import { Intents } from "@statewalker/shared-intents";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { activeFileExplorerPanels } from "./extension-points.js";

/**
 * Logic-fragment init for `@statewalker/file-explorer`.
 *
 * Per-panel orchestration (`PanelController`) is constructed by the
 * renderer; this init registers the workspace-level glue:
 *
 *   - `files:open` intent handler — probes the URI's kind on the
 *     workspace's `FilesApi`, then dispatches: folders to the panel
 *     identified by `panelId` (via the `file-explorer:active-panels`
 *     keyed slot), files to the existing `files:visualize` flow.
 *
 * Per ADR 0002 (logic-only): no React imports.
 */
export default function initFileExplorer(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  const intents = workspace.requireAdapter(Intents);
  const slots = workspace.requireAdapter(Slots);
  const panels = activeFileExplorerPanels(slots);

  const [register, cleanup] = newRegistry();

  register(
    handleOpen(intents, (intent) => {
      const { uri, panelId } = intent.payload;
      void (async () => {
        try {
          const files = workspace.files;
          const stats = await files.stats(uri);
          if (stats?.kind === "directory") {
            const panel = panelId ? panels.get(panelId) : null;
            if (!panel) {
              throw new Error(
                panelId
                  ? `files:open — no active file-explorer panel registered with id "${panelId}"`
                  : "files:open — directory navigation requires a panelId, none provided",
              );
            }
            panel.navigate(uri);
            intent.resolve();
            return;
          }
          // Anything else (file or unknown) goes through the
          // mime-renderer pipeline; if `stats` is undefined we still
          // delegate so existing not-found handling surfaces uniformly.
          await runVisualizeFile(intents, { uri }).promise;
          intent.resolve();
        } catch (err) {
          intent.reject(err instanceof Error ? err : new Error(String(err)));
        }
      })();
      return true;
    }),
  );

  return cleanup;
}
