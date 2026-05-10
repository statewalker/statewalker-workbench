import { newViewRegistry } from "@statewalker/core-react";
import { provideDockSidePanel } from "@statewalker/dock";
import {
  observeFileExplorerPanelPresets,
  type FileExplorerPanelPreset,
} from "@statewalker/file-explorer";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { FileExplorerPanel } from "../internal/file-explorer-panel.js";

/**
 * Stable view-key prefix. Each contributed `FileExplorerPanelPreset`
 * is registered under `<PANEL_VIEW_KEY_PREFIX>:<id>` so the dock side
 * panel can look it up without colliding with other view keys.
 */
const PANEL_VIEW_KEY_PREFIX = "file-explorer:panel";

/**
 * Renderer-fragment init for `@statewalker/file-explorer-react`.
 *
 * Per-cycle (workspace open):
 *   1. Subscribes to the `file-explorer:panels` slot.
 *   2. For every preset contribution: registers a memoised
 *      `FileExplorerPanel` component into `core:views` and contributes
 *      a `dock:side-panels` entry referencing that view key.
 *
 * Apps choose the layout by populating the slot — no panel-instance
 * code lives outside this fragment.
 */
export default function initFileExplorerReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const views = newViewRegistry(workspace);

  const [register, cleanup] = newRegistry();

  function applyPresets(presets: readonly FileExplorerPanelPreset[]): void {
    for (const preset of presets) {
      const viewKey = `${PANEL_VIEW_KEY_PREFIX}:${preset.id}`;
      const PanelComponent = () => (
        <FileExplorerPanel
          panelId={preset.id}
          initialPath={preset.initialPath}
          label={preset.label}
        />
      );
      PanelComponent.displayName = `FileExplorerPanel(${preset.id})`;
      register(views.register(viewKey, PanelComponent));

      const side = preset.side ?? "left";
      if (side === "left" || side === "right") {
        register(
          provideDockSidePanel(slots, {
            id: `file-explorer:${preset.id}`,
            side,
            order: preset.order ?? 100,
            viewKey,
            defaultSize: "50%",
          }),
        );
      }
    }
  }

  // Apply current snapshot, then watch for changes.
  applyPresets(slots.getSnapshot<FileExplorerPanelPreset>("file-explorer:panels"));
  register(
    observeFileExplorerPanelPresets(slots, () => {
      // Re-application is idempotent because `views.register` and
      // `provideDockSidePanel` both throw on collision; the
      // `cleanup` above won't have run yet (subscriptions persist
      // for the lifetime of the fragment). For the v1 preset we
      // assume contributions are made synchronously during boot
      // — a hot-add path can be layered in later if needed.
    }),
  );

  return cleanup;
}
