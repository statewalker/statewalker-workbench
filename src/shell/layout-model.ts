import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "../core/view-model.js";
import type { PanelContent } from "./layout-panel-model.js";
import { LayoutPanelModel } from "./layout-panel-model.js";
import {
  collectPanelNames,
  type DropPosition,
  isPanelNode,
  isSplitNode,
  type LayoutNode,
} from "./layout-types.js";

/**
 * Central layout model — defines named panels and their spatial arrangement.
 *
 * Holds a tree of split/panel nodes with proportions. Each panel node
 * corresponds to a `LayoutPanelModel` instance where content is published.
 * Controllers publish content via `layout.publish(panelName, content)`.
 * UI components subscribe to individual `LayoutPanelModel` instances via
 * `useUpdates(panel.onUpdate)`.
 */
export class LayoutModel extends ViewModel {
  root: LayoutNode;
  private _panels: Map<string, LayoutPanelModel> = new Map();
  private _activePanel: string;

  // Tab drag state
  tabDrag: {
    contentKey: string;
    sourcePanelName: string;
  } | null = null;

  pendingDrop: {
    contentKey: string;
    sourcePanelName: string;
    targetPanelName: string;
    suggestedPosition: DropPosition;
    dropCoords: { x: number; y: number };
  } | null = null;

  constructor(config: { root: LayoutNode; activePanel: string }) {
    super();
    this.root = config.root;
    this._activePanel = config.activePanel;
    for (const name of collectPanelNames(this.root)) {
      this._panels.set(name, new LayoutPanelModel(name));
    }
    // Set initial focus
    this._panels.get(this._activePanel)?.setFocused(true);
  }

  // ─── Panel access ───

  getPanel(name: string): LayoutPanelModel | undefined {
    return this._panels.get(name);
  }

  getAllPanels(): LayoutPanelModel[] {
    return [...this._panels.values()];
  }

  getPanelNames(): string[] {
    return [...this._panels.keys()];
  }

  getActivePanel(): LayoutPanelModel | undefined {
    return this._panels.get(this._activePanel);
  }

  get activePanel(): string {
    return this._activePanel;
  }

  // ─── Publishing (delegates to LayoutPanelModel) ───

  publish(panelName: string, content: PanelContent): () => void {
    const panel = this._panels.get(panelName);
    if (!panel) {
      throw new Error(`Panel "${panelName}" not found in layout`);
    }
    return panel.publish(content);
  }

  publishOrActivate(panelName: string, content: PanelContent): () => void {
    // Check all panels for existing key
    for (const [name, panel] of this._panels) {
      if (panel.findContent(content.key)) {
        panel.activateTab(content.key);
        this.setActivePanel(name);
        return () => panel.unpublish(content.key);
      }
    }
    return this.publish(panelName, content);
  }

  // ─── Active panel ───

  setActivePanel(panelName: string): void {
    if (this._activePanel === panelName) return;
    this._panels.get(this._activePanel)?.setFocused(false);
    this._activePanel = panelName;
    this._panels.get(panelName)?.setFocused(true);
    this.notify();
  }

  focusNextPanel(): void {
    const names = this.getPanelNames();
    if (names.length === 0) return;
    const idx = names.indexOf(this._activePanel);
    this.setActivePanel(names[(idx + 1) % names.length]!);
  }

  // ─── Proportions ───

  /**
   * Update split sizes at the given path in the tree.
   * Called by UI on resize — does NOT notify (resize library handles visually).
   */
  setSizes(splitPath: number[], sizes: number[]): void {
    const split = this._findSplitByPath(splitPath);
    if (split) {
      split.sizes = sizes;
    }
  }

  /**
   * Programmatic resize — notifies so UI updates.
   */
  resizeSplit(splitPath: number[], sizes: number[]): void {
    this.setSizes(splitPath, sizes);
    this.notify();
  }

  // ─── Structural mutations ───

  splitPanel(
    panelName: string,
    direction: "horizontal" | "vertical",
    newPanelName: string,
  ): LayoutPanelModel {
    const newPanel = new LayoutPanelModel(newPanelName);
    this._panels.set(newPanelName, newPanel);
    this.root = this._wrapPanelInSplit(
      this.root,
      panelName,
      newPanelName,
      direction,
    );
    this.notify();
    return newPanel;
  }

  removePanel(panelName: string): void {
    this._panels.delete(panelName);
    this.root = this._removePanelFromTree(this.root, panelName) ?? this.root;
    if (this._activePanel === panelName) {
      const names = this.getPanelNames();
      if (names.length > 0) {
        this.setActivePanel(names[0]!);
      }
    }
    this.notify();
  }

  // ─── Tab drag lifecycle ───

  startTabDrag(contentKey: string, sourcePanelName: string): void {
    this.tabDrag = { contentKey, sourcePanelName };
    this.notify();
  }

  confirmTabDrop(targetPanelName: string, position: DropPosition): void {
    if (!this.tabDrag) return;
    const { contentKey, sourcePanelName } = this.tabDrag;

    const sourcePanel = this._panels.get(sourcePanelName);
    const content = sourcePanel?.findContent(contentKey);
    if (!sourcePanel || !content) {
      this.cancelTabDrop();
      return;
    }

    // Remove from source
    sourcePanel.unpublish(contentKey);

    if (position === "center") {
      // Add to existing target panel
      const targetPanel = this._panels.get(targetPanelName);
      targetPanel?.publish(content);
    } else {
      // Create new panel via split
      const newPanelName = `panel-${Date.now()}`;
      const newPanel = this.splitPanel(
        targetPanelName,
        position === "left" || position === "right" ? "horizontal" : "vertical",
        newPanelName,
      );
      newPanel.publish(content);
      // Reorder: for "left"/"top" the new panel should come first
      // splitPanel always appends — fix ordering
      this._reorderSplit(targetPanelName, newPanelName, position);
    }

    this.tabDrag = null;
    this.pendingDrop = null;
    this.notify();
  }

  cancelTabDrop(): void {
    this.tabDrag = null;
    this.pendingDrop = null;
    this.notify();
  }

  // ─── Serialization ───

  toJSON(): { root: LayoutNode; activePanel: string } {
    return { root: this.root, activePanel: this._activePanel };
  }

  static create(config: {
    root: LayoutNode;
    activePanel: string;
  }): LayoutModel {
    return new LayoutModel(config);
  }

  // ─── Private helpers ───

  private _findSplitByPath(
    path: number[],
  ): import("./layout-types.js").SplitNode | undefined {
    let node = this.root;
    for (const idx of path) {
      if (!isSplitNode(node)) return undefined;
      const child = node.children[idx];
      if (!child) return undefined;
      node = child;
    }
    return isSplitNode(node) ? node : undefined;
  }

  private _wrapPanelInSplit(
    node: LayoutNode,
    panelName: string,
    newPanelName: string,
    direction: "horizontal" | "vertical",
  ): LayoutNode {
    if (isPanelNode(node)) {
      if (node.name === panelName) {
        return {
          type: "split",
          direction,
          children: [node, { type: "panel", name: newPanelName }],
          sizes: [50, 50],
        };
      }
      return node;
    }
    return {
      ...node,
      children: node.children.map((child) =>
        this._wrapPanelInSplit(child, panelName, newPanelName, direction),
      ),
    };
  }

  private _removePanelFromTree(
    node: LayoutNode,
    panelName: string,
  ): LayoutNode | null {
    if (isPanelNode(node)) {
      return node.name === panelName ? null : node;
    }

    const newChildren: LayoutNode[] = [];
    const newSizes: number[] = [];

    for (let i = 0; i < node.children.length; i++) {
      const result = this._removePanelFromTree(node.children[i]!, panelName);
      if (result) {
        newChildren.push(result);
        newSizes.push(node.sizes[i]!);
      }
    }

    if (newChildren.length === 0) return null;
    if (newChildren.length === 1) return newChildren[0]!;

    // Normalize sizes
    const total = newSizes.reduce((a, b) => a + b, 0);
    return {
      ...node,
      children: newChildren,
      sizes: newSizes.map((s) => (s / total) * 100),
    };
  }

  private _reorderSplit(
    existingPanelName: string,
    newPanelName: string,
    position: DropPosition,
  ): void {
    // For "left"/"top", new panel should be first child
    if (position !== "left" && position !== "top") return;

    const reorder = (node: LayoutNode): LayoutNode => {
      if (isPanelNode(node)) return node;
      const idx = node.children.findIndex(
        (c) =>
          isSplitNode(c) &&
          c.children.some(
            (cc) =>
              (isPanelNode(cc) && cc.name === existingPanelName) ||
              (isPanelNode(cc) && cc.name === newPanelName),
          ),
      );
      if (idx >= 0) {
        const split = node.children[idx]!;
        if (isSplitNode(split)) {
          const existingIdx = split.children.findIndex(
            (c) => isPanelNode(c) && c.name === existingPanelName,
          );
          const newIdx = split.children.findIndex(
            (c) => isPanelNode(c) && c.name === newPanelName,
          );
          if (existingIdx >= 0 && newIdx >= 0 && newIdx > existingIdx) {
            const children = [...split.children];
            const sizes = [...split.sizes];
            [children[existingIdx], children[newIdx]] = [
              children[newIdx]!,
              children[existingIdx]!,
            ];
            [sizes[existingIdx], sizes[newIdx]] = [
              sizes[newIdx]!,
              sizes[existingIdx]!,
            ];
            const newSplit = { ...split, children, sizes };
            const nodeChildren = [...node.children];
            nodeChildren[idx] = newSplit;
            return { ...node, children: nodeChildren };
          }
        }
      }
      return { ...node, children: node.children.map(reorder) };
    };
    this.root = reorder(this.root);
  }
}

export const [getLayoutModel] = newAdapter<LayoutModel>("aspect:layout");
