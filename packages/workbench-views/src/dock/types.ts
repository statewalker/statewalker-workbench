export type DropPosition = "left" | "right" | "top" | "bottom" | "center";

export interface DockTab {
  id: string;
  title: string;
  icon?: string;
  panelModel: unknown; // Generic — renderers cast to specific view type
  closable?: boolean;
}

export interface DockPanel {
  id: string;
  tabs: DockTab[];
  activeTabId: string | null;
}

export interface DockSplit {
  id: string;
  direction: "horizontal" | "vertical";
  children: (DockPanel | DockSplit)[];
  sizes: number[];
}

export type DockNode = DockPanel | DockSplit;

export function isPanel(node: DockNode): node is DockPanel {
  return "tabs" in node;
}

export function isSplit(node: DockNode): node is DockSplit {
  return "direction" in node;
}
