import { newAdapter } from "@repo/shared/adapters";
import type { DialogModel } from "../dialog-model.js";
import {
  createModelPoint,
  UIModelRegistry,
} from "../models/ui-model-registry.js";

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
