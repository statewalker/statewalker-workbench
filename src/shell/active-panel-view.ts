import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "../core/view-model.js";

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

/**
 * Activate a panel tab by key — sets the active panel on the shared model.
 * Controllers call this; views listen to the model to highlight + bring to front.
 */
export function activatePanel(
  context: Record<string, unknown>,
  panelKey: string,
): void {
  getActivePanelView(context).setActivePanel(panelKey);
}
