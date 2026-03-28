import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { DialogModel } from "../overlays/dialog-model.js";

export class DialogStackModel extends UIModelRegistry<DialogModel> {
  getTopmost(): DialogModel | null {
    const items = this.getAll();
    return items.length > 0 ? items[items.length - 1]! : null;
  }
}

export const [getDialogStackModel] = newAdapter<DialogStackModel>(
  "aspect:dialogs",
  () => new DialogStackModel(),
);

export const [publishDialog, listenDialog] =
  createModelPoint<DialogModel>(getDialogStackModel);
