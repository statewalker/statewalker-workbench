import { ViewModel } from "../core/view-model.js";
import type { ActionView } from "./action-view.js";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export class ButtonGroupModel extends ViewModel {
  orientation: ButtonGroupOrientation;
  dense: boolean;
  actions: ActionView[];

  constructor(options: {
    orientation?: ButtonGroupOrientation;
    dense?: boolean;
    actions: ActionView[];
    key?: string;
  }) {
    super({ key: options.key });
    this.orientation = options.orientation ?? "horizontal";
    this.dense = options.dense ?? false;
    this.actions = options.actions;
  }

  setActions(actions: ActionView[]) {
    this.actions = actions;
    this.notify();
  }
}
