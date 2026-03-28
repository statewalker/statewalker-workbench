import type { ActionModel } from "../actions/action-model.js";
import { ViewModel } from "../core/view-model.js";

export class ContextMenuModel extends ViewModel {
  items: ActionModel[];
  target: ViewModel;

  constructor(options: {
    items: ActionModel[];
    target: ViewModel;
    key?: string;
  }) {
    super({ key: options.key });
    this.items = options.items;
    this.target = options.target;
  }

  setItems(items: ActionModel[]) {
    this.items = items;
    this.notify();
  }
}
