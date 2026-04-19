import { newAdapter } from "@repo/shared-adapters";
import { ViewModel } from "../core/view-model.js";
import { getPanelManagerView } from "./panel-manager-view.js";

/** @deprecated Use PanelManagerView instead. */
export class ActivePanelView extends ViewModel {
  activePanelKey: string | null = null;

  setActivePanel(key: string | null): void {
    if (this.activePanelKey !== key) {
      this.activePanelKey = key;
      this.notify();
    }
  }
}

/** @deprecated Use getPanelManagerView instead. */
export const [getActivePanelView] = newAdapter<ActivePanelView>(
  "model:activePanel",
  () => new ActivePanelView(),
);

/**
 * Focus a panel tab by key.
 * Delegates to PanelManagerView.focus() which also sets the tab
 * as active in its area.
 */
export function activatePanel(
  context: Record<string, unknown>,
  panelKey: string,
): void {
  getPanelManagerView(context).focus(panelKey);
}
