import { newAdapter } from "@statewalker/shared-adapters";
import { ViewModel } from "../core/view-model.js";
import { getPanelManagerView } from "./panel-manager-view.js";

export class ActivePanelView extends ViewModel {
  activePanelKey: string | null = null;

  setActivePanel(key: string | null): void {
    if (this.activePanelKey !== key) {
      this.activePanelKey = key;
      this.notify();
    }
  }
}

export const [getActivePanelView] = newAdapter<ActivePanelView>(
  "model:activePanel",
  () => new ActivePanelView(),
);

/** Focus a panel tab by key. */
export function activatePanel(context: Record<string, unknown>, panelKey: string): void {
  getPanelManagerView(context).focus(panelKey);
}
