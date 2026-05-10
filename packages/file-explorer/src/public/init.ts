import { runFocusPanel } from "@statewalker/dock";
import { handleOpen, runVisualizeFile } from "@statewalker/files";
import { Intents } from "@statewalker/shared-intents";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { fileExplorerPanelId } from "./catalog.js";
import { type ActiveFileExplorerPanel, activeFileExplorerPanels } from "./extension-points.js";

/**
 * Logic-fragment init for `@statewalker/file-explorer`.
 *
 * Registers the workspace-level glue:
 *
 *   - `files:open` intent handler — probes the URI's kind on the
 *     workspace's `FilesApi` and routes by role:
 *       * directory → the panel flagged `folderNavigationHost`
 *         (falls back to `panelId` from the click, then any active
 *         panel) and brings that panel's tab into focus.
 *       * file → `files:visualize` with `referencePanelId` set to
 *         the panel flagged `mainViewerHost`, so viewers always
 *         dock into a known group regardless of which panel was
 *         clicked.
 *
 * Per ADR 0002 (logic-only): no React imports.
 */
export default function initFileExplorer(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  const intents = workspace.requireAdapter(Intents);
  const slots = workspace.requireAdapter(Slots);
  const panels = activeFileExplorerPanels(slots);

  const [register, cleanup] = newRegistry();

  function findHostId(predicate: (p: ActiveFileExplorerPanel) => boolean): string | null {
    for (const [id, panel] of panels.entries()) {
      if (predicate(panel)) return id;
    }
    return null;
  }

  register(
    handleOpen(intents, (intent) => {
      const { uri, panelId } = intent.payload;
      void (async () => {
        try {
          const files = workspace.files;
          const stats = await files.stats(uri);
          if (stats?.kind === "directory") {
            // Folder routing priority: folderNavigationHost > clicked
            // panelId > first registered. Fall through if no panel
            // is mounted (rather than throwing) so the intent surface
            // stays forgiving of teardown timing.
            const navHostId = findHostId((p) => p.isFolderNavigationHost);
            const targetId =
              navHostId ??
              (panelId && panels.get(panelId) ? panelId : null) ??
              [...panels.entries().keys()][0] ??
              null;
            if (!targetId) {
              throw new Error(
                "files:open — no active file-explorer panel registered to host folder navigation",
              );
            }
            const panel = panels.get(targetId);
            if (!panel) {
              throw new Error(`files:open — stale panel registration for "${targetId}"`);
            }
            panel.navigate(uri);
            // Bring the tab into focus so the navigation is visible
            // even when the user clicked from the *other* panel.
            runFocusPanel(intents, { panelId: fileExplorerPanelId(targetId) }).promise.catch(() => {
              // Focus is best-effort: a panel that hasn't been
              // dock-shown yet has nothing to focus. Swallow.
            });
            intent.resolve();
            return;
          }
          // Files (and unknowns) go through the mime-renderer pipeline.
          // The viewer-host panel id is forwarded as `referencePanelId`
          // so the dock fragment opens the tab inside that panel's
          // group rather than wherever the active group happens to be.
          const viewerHostId = findHostId((p) => p.isMainViewerHost);
          await runVisualizeFile(intents, {
            uri,
            referencePanelId: viewerHostId ? fileExplorerPanelId(viewerHostId) : undefined,
          }).promise;
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
