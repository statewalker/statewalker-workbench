import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "../core/view-model.js";
import type { DockPanelView } from "./panel-view.js";

/**
 * Manages the dock panel state:
 *
 * - **Tab order per area** — panels grouped by area, order preserved
 * - **Active tab per area** — each area has one visible tab
 * - **Focused tab (global)** — one tab across all areas is focused;
 *   focusing a tab also makes it active in its area
 *
 * Controllers call `focus(tabKey)` to bring a tab to the foreground.
 * The rendering layer reads `focusedTabKey` and `getActiveTab(area)`.
 */
export class PanelManagerView extends ViewModel {
  /** All registered panels keyed by their ViewModel key. */
  readonly #panels = new Map<string, DockPanelView>();
  /** Panels grouped by area, in insertion order. */
  readonly #areas = new Map<string, string[]>();
  /** Active (visible) tab per area. */
  readonly #activeByArea = new Map<string, string>();
  /** The one globally focused tab. */
  #focusedTabKey: string | null = null;

  // ── Query ────────────────────────────────────────────────

  get focusedTabKey(): string | null {
    return this.#focusedTabKey;
  }

  getActiveTab(area: string): string | null {
    return this.#activeByArea.get(area) ?? null;
  }

  getTabOrder(area: string): string[] {
    return this.#areas.get(area) ?? [];
  }

  getAreas(): string[] {
    return [...this.#areas.keys()];
  }

  getPanel(key: string): DockPanelView | undefined {
    return this.#panels.get(key);
  }

  getAllPanels(): DockPanelView[] {
    return [...this.#panels.values()];
  }

  // ── Mutation ─────────────────────────────────────────────

  /**
   * Register a panel. Returns a dispose function that removes it.
   * Does NOT change the active or focused tab (the caller decides).
   */
  addPanel(panel: DockPanelView): () => void {
    const key = panel.key;
    const area = panel.area || "center";
    this.#panels.set(key, panel);

    let order = this.#areas.get(area);
    if (!order) {
      order = [];
      this.#areas.set(area, order);
    }
    order.push(key);

    // If this area had no active tab, make this one active
    if (!this.#activeByArea.has(area)) {
      this.#activeByArea.set(area, key);
    }

    this.notify();
    return () => this.removePanel(key);
  }

  removePanel(key: string): void {
    const panel = this.#panels.get(key);
    if (!panel) return;
    const area = panel.area || "center";
    this.#panels.delete(key);

    const order = this.#areas.get(area);
    if (order) {
      const idx = order.indexOf(key);
      if (idx >= 0) order.splice(idx, 1);
      if (order.length === 0) {
        this.#areas.delete(area);
        this.#activeByArea.delete(area);
      } else if (this.#activeByArea.get(area) === key) {
        // Active tab was removed — pick neighbor
        this.#activeByArea.set(area, order[Math.min(idx, order.length - 1)]!);
      }
    }

    if (this.#focusedTabKey === key) {
      this.#focusedTabKey = null;
    }

    this.notify();
  }

  /**
   * Set the active (visible) tab in a specific area.
   * Does NOT change the global focus.
   */
  setActiveTab(area: string, tabKey: string): void {
    const order = this.#areas.get(area);
    if (!order?.includes(tabKey)) return;
    if (this.#activeByArea.get(area) === tabKey) return;
    this.#activeByArea.set(area, tabKey);
    this.notify();
  }

  /**
   * Focus a tab globally. This also makes it the active tab in its area.
   */
  focus(tabKey: string | null): void {
    if (this.#focusedTabKey === tabKey) return;
    this.#focusedTabKey = tabKey;

    if (tabKey) {
      const panel = this.#panels.get(tabKey);
      if (panel) {
        const area = panel.area || "center";
        this.#activeByArea.set(area, tabKey);
      }
    }

    this.notify();
  }

  /**
   * Reorder tabs within an area.
   */
  reorderTabs(area: string, order: string[]): void {
    this.#areas.set(area, order);
    this.notify();
  }

  /**
   * Find which area contains a tab.
   */
  getAreaForTab(tabKey: string): string | undefined {
    const panel = this.#panels.get(tabKey);
    return panel ? panel.area || "center" : undefined;
  }
}

export const [getPanelManagerView, setPanelManagerView] =
  newAdapter<PanelManagerView>(
    "model:panel-manager",
    () => new PanelManagerView(),
  );
