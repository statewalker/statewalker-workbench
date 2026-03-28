import { ViewModel } from "../core/view-model.js";
import type { ActionModel } from "./action-model.js";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export class ButtonGroupModel extends ViewModel {
  orientation: ButtonGroupOrientation;
  dense: boolean;
  actions: ActionModel[];

  constructor(options: {
    orientation?: ButtonGroupOrientation;
    dense?: boolean;
    actions: ActionModel[];
    key?: string;
  }) {
    super({ key: options.key });
    this.orientation = options.orientation ?? "horizontal";
    this.dense = options.dense ?? false;
    this.actions = options.actions;
  }

  setActions(actions: ActionModel[]) {
    this.actions = actions;
    this.notify();
  }
}
