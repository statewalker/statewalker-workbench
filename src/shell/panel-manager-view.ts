import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "../core/view-model.js";
import {
  addTabToPanel,
  type DockNode,
  type DockPanel,
  type DockSplit,
  type DockTab,
  type DropPosition,
  findAndRemoveTab,
  findPanel,
  findPanelContainingTab,
  generateId,
  isPanel,
  removeTabById,
  updatePanelActiveTab,
  updateSplitSizes,
} from "../dock/index.js";
import type { DockPanelView } from "./panel-view.js";

/**
 * Default id for the center area container panel. Used when the dock tree
 * starts empty so the first panel can land somewhere.
 */
const CENTER_AREA_ID = "area-center";

function areaPanelId(area: string): string {
  return `area-${area}`;
}

function makeTab(panel: DockPanelView): DockTab {
  return {
    id: panel.key,
    title: panel.label,
    icon: panel.icon,
    panelModel: panel,
    closable: panel.closable,
  };
}

/**
 * Insert a brand-new area panel into the tree at a sensible default
 * position based on the area name. Always composes with the existing
 * tree — never replaces it — so earlier panels are not lost when
 * panels arrive out of order (e.g. a "left" panel before "center").
 */
function insertAreaPanel(
  tree: DockNode,
  area: string,
  newPanel: DockPanel,
): DockNode {
  const split = (
    direction: "horizontal" | "vertical",
    first: DockNode,
    second: DockNode,
    sizes: [number, number],
  ): DockSplit => ({
    id: generateId(),
    direction,
    children: [first, second] as (DockPanel | DockSplit)[],
    sizes,
  });
  switch (area) {
    case "left":
      return split("horizontal", newPanel, tree, [25, 75]);
    case "right":
      return split("horizontal", tree, newPanel, [70, 30]);
    case "top":
      return split("vertical", newPanel, tree, [30, 70]);
    case "bottom":
      return split("vertical", tree, newPanel, [70, 30]);
    case "center":
      // No area-center yet; put the new center in the main position
      return split("horizontal", newPanel, tree, [70, 30]);
    default:
      return split("horizontal", tree, newPanel, [70, 30]);
  }
}

/**
 * PanelManagerView — authoritative view model for the dock layout.
 *
 * Owns BOTH the set of registered panels and the dock tree (splits/panels).
 * All mutations — add/remove panels, drag-and-drop moves, active tab,
 * focus, resize — happen here. The UI layer is a pure projection that
 * subscribes via `onUpdate` and reads `getTree()`.
 */
export class PanelManagerView extends ViewModel {
  readonly #panels = new Map<string, DockPanelView>();
  #tree: DockNode = {
    id: CENTER_AREA_ID,
    tabs: [],
    activeTabId: null,
  };
  #focusedTabKey: string | null = null;

  // ── Queries ──────────────────────────────────────────────

  /** The full dock tree (splits + panels + tabs). Read by the UI. */
  getTree(): DockNode {
    return this.#tree;
  }

  get focusedTabKey(): string | null {
    return this.#focusedTabKey;
  }

  getPanel(key: string): DockPanelView | undefined {
    return this.#panels.get(key);
  }

  getAllPanels(): DockPanelView[] {
    return [...this.#panels.values()];
  }

  /** Find the tree panel that currently contains the given tab. */
  getPanelIdForTab(tabKey: string): string | null {
    return findPanelContainingTab(this.#tree, tabKey)?.id ?? null;
  }

  // ── Mutations: panel registry ────────────────────────────

  /**
   * Register a panel and place its tab in the tree. Returns a disposer
   * that removes the panel again.
   */
  addPanel(panel: DockPanelView): () => void {
    if (this.#panels.has(panel.key)) {
      return () => this.removePanel(panel.key);
    }

    this.#panels.set(panel.key, panel);

    const tab = makeTab(panel);
    const area = panel.area || "center";
    const targetId = areaPanelId(area);
    const existing = findPanel(this.#tree, targetId);

    if (existing) {
      // Area panel already exists — just append the tab
      this.#tree = addTabToPanel(this.#tree, targetId, tab, "center");
    } else if (
      isPanel(this.#tree) &&
      this.#tree.id === CENTER_AREA_ID &&
      this.#tree.tabs.length === 0 &&
      area !== "center"
    ) {
      // Only the empty center placeholder exists and the new panel is
      // for a non-center area. Replace the placeholder entirely so we
      // don't render a phantom empty dock.
      this.#tree = { id: targetId, tabs: [tab], activeTabId: tab.id };
    } else {
      const newAreaPanel: DockPanel = {
        id: targetId,
        tabs: [tab],
        activeTabId: tab.id,
      };
      this.#tree = insertAreaPanel(this.#tree, area, newAreaPanel);
    }

    this.notify();
    return () => this.removePanel(panel.key);
  }

  removePanel(key: string): void {
    if (!this.#panels.has(key)) return;
    this.#panels.delete(key);

    const { node } = removeTabById(this.#tree, key);
    this.#tree = node ?? {
      id: CENTER_AREA_ID,
      tabs: [],
      activeTabId: null,
    };

    if (this.#focusedTabKey === key) {
      this.#focusedTabKey = null;
    }

    this.notify();
  }

  // ── Mutations: tree structure / DnD ─────────────────────

  /**
   * Is this DnD move allowed? Used by the UI to decide whether to
   * accept a drop and show the drop confirmation. All tree inspection
   * happens here so the UI never reaches into the tree itself.
   */
  canMoveTab(
    sourcePanelId: string,
    targetPanelId: string,
    position: DropPosition,
  ): boolean {
    // Dropping into the same panel at center is a no-op, not a real move
    if (sourcePanelId === targetPanelId && position === "center") {
      return false;
    }
    // Splitting the same panel only makes sense when it has 2+ tabs
    if (sourcePanelId === targetPanelId && position !== "center") {
      const panel = findPanel(this.#tree, sourcePanelId);
      if (!panel || panel.tabs.length <= 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Move a tab between dock panels. Used by drag-and-drop.
   *
   * - position === "center": merge into targetPanelId's tab list
   * - position === "left"/"right"/"top"/"bottom": create a new split
   */
  moveTab(
    tabId: string,
    sourcePanelId: string,
    targetPanelId: string,
    position: DropPosition,
  ): void {
    if (!this.canMoveTab(sourcePanelId, targetPanelId, position)) return;

    const { node: afterRemoval, tab } = findAndRemoveTab(
      this.#tree,
      sourcePanelId,
      tabId,
    );
    if (!tab || !afterRemoval) return;

    this.#tree = addTabToPanel(afterRemoval, targetPanelId, tab, position);
    // Drop target takes focus — the user's intent was to bring this
    // tab to the foreground.
    this.#focusedTabKey = tabId;
    this.notify();
  }

  /** Change the active (visible) tab within a specific panel. */
  setActiveTab(panelId: string, tabId: string): void {
    const panel = findPanel(this.#tree, panelId);
    if (!panel || panel.activeTabId === tabId) return;
    if (!panel.tabs.some((t) => t.id === tabId)) return;
    this.#tree = updatePanelActiveTab(this.#tree, panelId, tabId);
    this.notify();
  }

  /**
   * Focus a tab globally. Also makes it the active tab in its panel.
   */
  focus(tabKey: string | null): void {
    if (this.#focusedTabKey === tabKey) {
      return;
    }
    this.#focusedTabKey = tabKey;

    if (tabKey) {
      const containing = findPanelContainingTab(this.#tree, tabKey);
      if (containing && containing.activeTabId !== tabKey) {
        this.#tree = updatePanelActiveTab(this.#tree, containing.id, tabKey);
      }
    }
    this.notify();
  }

  /** Update the split sizes (resize operation). */
  updateSplitSizes(splitId: string, sizes: number[]): void {
    this.#tree = updateSplitSizes(this.#tree, splitId, sizes);
    this.notify();
  }

  /** Remove a tab by its id, regardless of which panel contains it. */
  closeTab(tabKey: string): void {
    this.removePanel(tabKey);
  }
}

export const [getPanelManagerView, setPanelManagerView] =
  newAdapter<PanelManagerView>(
    "model:panel-manager",
    () => new PanelManagerView(),
  );
