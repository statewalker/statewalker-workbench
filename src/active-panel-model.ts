import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "./view-model.js";

export class ActivePanelModel extends ViewModel {
  activePanelKey: string | null = null;

  setActivePanel(key: string | null): void {
    if (this.activePanelKey !== key) {
      this.activePanelKey = key;
      this.notify();
    }
  }
}

export const [getActivePanelModel] = newAdapter<ActivePanelModel>(
  "model:activePanel",
  () => new ActivePanelModel(),
);

/**
 * Activate a panel tab by key — sets the active panel on the shared model.
 * Controllers call this; views listen to the model to highlight + bring to front.
 */
export function activatePanel(
  context: Record<string, unknown>,
  panelKey: string,
): void {
  getActivePanelModel(context).setActivePanel(panelKey);
}
