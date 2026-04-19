import { newAdapter } from "@statewalker/shared-adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { DialogView } from "../overlays/dialog-view.js";

export class DialogStackView extends UIModelRegistry<DialogView> {
  getTopmost(): DialogView | null {
    const items = this.getAll();
    return items.length > 0 ? items[items.length - 1]! : null;
  }
}

export const [getDialogStackView] = newAdapter<DialogStackView>(
  "aspect:dialogs",
  () => new DialogStackView(),
);

export const [publishDialog, listenDialog] =
  createModelPoint<DialogView>(getDialogStackView);
