import { useAppWorkspace } from "@statewalker/core-react";
import { createPanelController, type PanelController } from "@statewalker/file-explorer";
import { runVisualizeFile } from "@statewalker/files";
import { Intents } from "@statewalker/shared-intents";
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
 * One file-explorer panel. Constructs a `PanelController` over the
 * workspace's primary `FilesApi`, wires file-activation to the
 * `files:visualize` intent, and renders the list view.
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
  const intents = workspace.requireAdapter(Intents);

  const panel: PanelController = useMemo(() => {
    const controller = createPanelController({
      files: workspace.files,
      title: label ?? panelId,
      onOpenFile: (path) => {
        runVisualizeFile(intents, { uri: path }).promise.catch((err) => {
          console.error("[file-explorer] visualize failed:", err);
        });
      },
    });
    if (initialPath && initialPath !== "/") {
      controller.navigate(initialPath);
    }
    return controller;
  }, [workspace, intents, panelId, label, initialPath]);

  useEffect(() => panel.cleanup, [panel]);

  return <FilesListView model={panel.model} panelId={panelId} />;
}
