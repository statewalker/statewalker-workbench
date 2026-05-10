import { newSlot } from "@statewalker/shared-slots";

/**
 * `file-explorer:panels` — declarative two-pane preset contributions.
 *
 * Each contribution lights up one file-explorer panel inside the dock
 * (or a dock side panel) when the workspace boots. `explorer.app`
 * contributes two of these on first boot to recreate the
 * commander-style two-pane layout (the "two-pane preset" requirement
 * in the `file-management-split` capability spec).
 */
export interface FileExplorerPanelPreset {
  /** Stable id (e.g. "explorer:left", "explorer:right"). */
  id: string;
  /** Display label for the panel/tab. */
  label: string;
  /**
   * Initial path to load. The renderer constructs a `PanelController`
   * with the workspace's current `FilesApi` and navigates to this path.
   */
  initialPath?: string;
  /**
   * Where this panel should live. When omitted, the renderer chooses
   * based on the contribution's `order` (lowest goes left).
   */
  side?: "left" | "right" | "main";
  /** Lower wins; defaults to 100. */
  order?: number;
}

export const [provideFileExplorerPanelPreset, observeFileExplorerPanelPresets] =
  newSlot<FileExplorerPanelPreset>("file-explorer:panels");
