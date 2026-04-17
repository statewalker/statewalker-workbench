import type {
  DockNode,
  DockPanel,
  DockSplit,
  DockTab,
  DropPosition,
} from "./types.js";
import { isPanel } from "./types.js";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function findAndRemoveTab(
  node: DockNode,
  panelId: string,
  tabId: string,
): { node: DockNode | null; tab: DockTab | null } {
  if (isPanel(node)) {
    if (node.id === panelId) {
      const tabIndex = node.tabs.findIndex((t) => t.id === tabId);
      if (tabIndex === -1) return { node, tab: null };

      const tab = node.tabs[tabIndex]!;
      const newTabs = node.tabs.filter((t) => t.id !== tabId);

      if (newTabs.length === 0) {
        return { node: null, tab };
      }

      const newActiveTabId =
        node.activeTabId === tabId
          ? (newTabs[Math.min(tabIndex, newTabs.length - 1)]?.id ?? null)
          : node.activeTabId;

      return {
        node: { ...node, tabs: newTabs, activeTabId: newActiveTabId },
        tab,
      };
    }
    return { node, tab: null };
  }

  let removedTab: DockTab | null = null;
  const newChildren: (DockPanel | DockSplit)[] = [];
  const newSizes: number[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    const result = findAndRemoveTab(child, panelId, tabId);

    if (result.tab && !removedTab) {
      removedTab = result.tab;
    }

    if (result.node) {
      newChildren.push(result.node as DockPanel | DockSplit);
      newSizes.push(node.sizes[i]!);
    }
  }

  if (newChildren.length === 0) {
    return { node: null, tab: removedTab };
  }

  if (newChildren.length === 1) {
    return { node: newChildren[0]!, tab: removedTab };
  }

  const totalSize = newSizes.reduce((a, b) => a + b, 0);
  const normalizedSizes = newSizes.map((s) => (s / totalSize) * 100);

  return {
    node: { ...node, children: newChildren, sizes: normalizedSizes },
    tab: removedTab,
  };
}

export function addTabToPanel(
  node: DockNode,
  targetPanelId: string,
  tab: DockTab,
  position: DropPosition,
  /** Pre-generated ID for the new panel created by split drops. */
  newPanelId?: string,
): DockNode {
  if (isPanel(node)) {
    if (node.id === targetPanelId) {
      if (position === "center") {
        return {
          ...node,
          tabs: [...node.tabs, tab],
          activeTabId: tab.id,
        };
      }

      const newPanel: DockPanel = {
        id: newPanelId ?? generateId(),
        tabs: [tab],
        activeTabId: tab.id,
      };

      const direction: "horizontal" | "vertical" =
        position === "left" || position === "right" ? "horizontal" : "vertical";

      const children: DockPanel[] =
        position === "left" || position === "top"
          ? [newPanel, node]
          : [node, newPanel];

      return {
        id: generateId(),
        direction,
        children,
        sizes: [50, 50],
      };
    }
    return node;
  }

  return {
    ...node,
    children: node.children.map((child) =>
      addTabToPanel(child, targetPanelId, tab, position),
    ) as (DockPanel | DockSplit)[],
  };
}

/**
 * Remove a tab by its ID, searching all panels in the tree.
 * Unlike findAndRemoveTab, this doesn't require knowing the panel ID.
 */
export function removeTabById(
  node: DockNode,
  tabId: string,
): { node: DockNode | null; tab: DockTab | null } {
  if (isPanel(node)) {
    const tabIndex = node.tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return { node, tab: null };
    return findAndRemoveTab(node, node.id, tabId);
  }

  let removedTab: DockTab | null = null;
  const newChildren: (DockPanel | DockSplit)[] = [];
  const newSizes: number[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    const result = removeTabById(child, tabId);

    if (result.tab && !removedTab) {
      removedTab = result.tab;
    }

    if (result.node) {
      newChildren.push(result.node as DockPanel | DockSplit);
      newSizes.push(node.sizes[i]!);
    }
  }

  if (newChildren.length === 0) return { node: null, tab: removedTab };
  if (newChildren.length === 1)
    return { node: newChildren[0]!, tab: removedTab };

  const totalSize = newSizes.reduce((a, b) => a + b, 0);
  const normalizedSizes = newSizes.map((s) => (s / totalSize) * 100);

  return {
    node: { ...node, children: newChildren, sizes: normalizedSizes },
    tab: removedTab,
  };
}

export function findPanel(node: DockNode, panelId: string): DockPanel | null {
  if (isPanel(node)) {
    return node.id === panelId ? node : null;
  }
  for (const child of node.children) {
    const found = findPanel(child, panelId);
    if (found) return found;
  }
  return null;
}

export function updatePanelActiveTab(
  node: DockNode,
  panelId: string,
  tabId: string,
): DockNode {
  if (isPanel(node)) {
    if (node.id === panelId) {
      return { ...node, activeTabId: tabId };
    }
    return node;
  }

  return {
    ...node,
    children: node.children.map((child) =>
      updatePanelActiveTab(child, panelId, tabId),
    ) as (DockPanel | DockSplit)[],
  };
}

export function updateSplitSizes(
  node: DockNode,
  splitId: string,
  sizes: number[],
): DockNode {
  if (isPanel(node)) {
    return node;
  }

  if (node.id === splitId) {
    return { ...node, sizes };
  }

  return {
    ...node,
    children: node.children.map((child) =>
      updateSplitSizes(child, splitId, sizes),
    ) as (DockPanel | DockSplit)[],
  };
}
