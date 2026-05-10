import { useAdapter, useAppWorkspace } from "@statewalker/core-react";
import {
  activeFileExplorerPanels,
  createPanelController,
  type PanelController,
} from "@statewalker/file-explorer";
import { runOpen } from "@statewalker/files";
import { Intents } from "@statewalker/shared-intents";
import { Slots } from "@statewalker/shared-slots";
import { type ReactElement, useEffect, useMemo } from "react";
import { FilesListView } from "./files-list-view.js";

export interface FileExplorerPanelProps {
  /** Stable id used for DnD channel + future addressing. */
  panelId: string;
  /** Initial directory; defaults to "/". */
  initialPath?: string;
  /** Tab/panel label propagated to the model's `title`. */
  label?: string;
}

/**
 * One file-explorer panel. The panel owns its `PanelController`
 * (model + I/O glue) but stays decoupled from activation routing —
 * every click/keypress dispatches `files:open` with this panel's id,
 * and the workspace-level intent handler routes folders back to this
 * panel via the `file-explorer:active-panels` registry.
 *
 * Two-pane preset (explorer.app): the renderer mounts two of these,
 * one with `panelId="left"` and one with `panelId="right"`.
 */
export function FileExplorerPanel({
  panelId,
  initialPath,
  label,
}: FileExplorerPanelProps): ReactElement {
  const workspace = useAppWorkspace();
  const intents = useAdapter(Intents);
  const slots = useAdapter(Slots);

  const panel: PanelController = useMemo(
    () =>
      createPanelController({
        files: workspace.files,
        title: label ?? panelId,
        initialPath,
      }),
    [workspace, panelId, label, initialPath],
  );

  useEffect(() => {
    const panels = activeFileExplorerPanels(slots);
    return panels.register(panelId, {
      navigate: (path) => panel.navigate(path),
    });
  }, [panel, panelId, slots]);

  function handleOpen(uri: string): void {
    runOpen(intents, { uri, panelId }).promise.catch((err) => {
      console.error("[file-explorer] files:open failed:", err);
    });
  }

  return <FilesListView model={panel.model} panelId={panelId} onOpen={handleOpen} />;
}
