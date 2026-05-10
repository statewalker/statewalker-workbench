import { KeyedSlot, newSlot, type Slots } from "@statewalker/shared-slots";

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

/**
 * Runtime handle exposed by an active file-explorer panel. Mounted
 * panels register one of these under their `panelId` so the
 * `files:open` intent handler can route directory navigations to the
 * right panel without coupling the intent layer to React.
 */
export interface ActiveFileExplorerPanel {
  /** Navigate this panel to `path`, loading it through the panel's `FilesApi`. */
  navigate(path: string): void;
}

export const FILE_EXPLORER_ACTIVE_PANELS = "file-explorer:active-panels";

/** Open a `KeyedSlot` over the active-panels registry. */
export function activeFileExplorerPanels(slots: Slots): KeyedSlot<ActiveFileExplorerPanel> {
  return new KeyedSlot<ActiveFileExplorerPanel>(slots, FILE_EXPLORER_ACTIVE_PANELS);
}
