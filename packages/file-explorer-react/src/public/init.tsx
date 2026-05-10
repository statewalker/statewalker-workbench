import { defineRegistry } from "@json-render/react";
import { compareByOrderAndId } from "@statewalker/core-react";
import { type PanelPosition, runShowDockPanel } from "@statewalker/dock";
import {
  FILE_EXPLORER_CATALOG_ID,
  type FileExplorerPanelPreset,
  fileExplorerCatalog,
  fileExplorerPanelId,
  fileExplorerSpecId,
  makeFileExplorerSpec,
  observeFileExplorerPanelPresets,
} from "@statewalker/file-explorer";
import { newCatalogRegistry, SpecStore } from "@statewalker/json-render";
import { Intents } from "@statewalker/shared-intents";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { FileExplorerPanel } from "../internal/file-explorer-panel.js";

/**
 * Renderer-fragment init for `@statewalker/file-explorer-react`.
 *
 * Concerns:
 *   1. **Catalog binding** — registers `FileExplorerView` (the React
 *      view that owns the panel's `PanelController` + `FilesListView`)
 *      against the `file-explorer` json-render catalog so dock tabs
 *      built from `makeFileExplorerSpec` resolve correctly.
 *   2. **Two-pane preset application** — when the workspace opens,
 *      reads the `file-explorer:panels` slot and dispatches one
 *      `dock:show-panel` per preset. Each panel becomes a regular dock
 *      tab in the central `DockViewHost`, mirroring how every other
 *      viewer (markdown, pdf, image, video) appears.
 *
 * The `side` field on a preset is interpreted as a dock-position hint:
 *   - the first preset opens at default position (a fresh group);
 *   - subsequent `side: "left"` / `"right"` presets create a split
 *     group on that side of the previous panel;
 *   - `side: "main"` (or unset) docks `"within"` the previous panel as
 *     an additional tab.
 */
export default function initFileExplorerReact(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  const intents = workspace.requireAdapter(Intents);
  const store = workspace.requireAdapter(SpecStore);
  const slots = workspace.requireAdapter(Slots);
  const catalogs = newCatalogRegistry(workspace);

  const [register, cleanup] = newRegistry();

  // ── Catalog binding ───────────────────────────────────────────
  const { registry } = defineRegistry(fileExplorerCatalog, {
    components: {
      FileExplorerView: ({ props }) => (
        <FileExplorerPanel
          panelId={props.panelId}
          label={props.label}
          initialPath={props.initialPath}
        />
      ),
    },
    actions: {},
  });
  register(catalogs.register(FILE_EXPLORER_CATALOG_ID, registry));

  // ── Two-pane preset application ───────────────────────────────
  const opened = new Set<string>();

  async function applyPresets(presets: readonly FileExplorerPanelPreset[]): Promise<void> {
    const sorted = [...presets].sort(compareByOrderAndId);
    for (let i = 0; i < sorted.length; i++) {
      const preset = sorted[i];
      if (!preset || opened.has(preset.id)) continue;

      const specId = fileExplorerSpecId(preset.id);
      if (!store.get(specId)) {
        store.create({
          id: specId,
          catalogId: FILE_EXPLORER_CATALOG_ID,
          spec: makeFileExplorerSpec(preset.id, preset.label, preset.initialPath),
          meta: { persistent: true },
        });
      }

      const position = i === 0 ? undefined : sidePosition(preset.side);
      try {
        await runShowDockPanel(intents, {
          panelId: fileExplorerPanelId(preset.id),
          specId,
          position,
        }).promise;
        opened.add(preset.id);
      } catch (err) {
        console.error("[file-explorer] failed to open dock panel:", preset.id, err);
      }
    }
  }

  function applyOnLoad(): void {
    void applyPresets(slots.getSnapshot<FileExplorerPanelPreset>("file-explorer:panels"));
  }

  // `workspace.onLoad` fires the callback immediately if already
  // opened, so a single subscription covers both first-load and
  // subsequent open() cycles.
  register(workspace.onLoad(applyOnLoad));

  register(
    observeFileExplorerPanelPresets(slots, () => {
      // Hot-added presets are applied opportunistically; opened panels
      // are tracked in `opened` so existing tabs aren't duplicated.
      if (workspace.isOpened) applyOnLoad();
    }),
  );

  register(workspace.onUnload(() => opened.clear()));

  return cleanup;
}

function sidePosition(side: FileExplorerPanelPreset["side"]): PanelPosition {
  if (side === "left" || side === "right") return side;
  return "within";
}
