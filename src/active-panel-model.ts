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
