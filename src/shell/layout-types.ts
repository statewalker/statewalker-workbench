export interface PanelNode {
  type: "panel";
  name: string;
}

export interface SplitNode {
  type: "split";
  direction: "horizontal" | "vertical";
  children: LayoutNode[];
  sizes: number[];
}

export type LayoutNode = PanelNode | SplitNode;

export type DropPosition = "left" | "right" | "top" | "bottom" | "center";

export function isPanelNode(node: LayoutNode): node is PanelNode {
  return node.type === "panel";
}

export function isSplitNode(node: LayoutNode): node is SplitNode {
  return node.type === "split";
}

export function collectPanelNames(node: LayoutNode): string[] {
  if (isPanelNode(node)) return [node.name];
  return node.children.flatMap(collectPanelNames);
}
