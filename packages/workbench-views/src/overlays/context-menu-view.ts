import type { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";

export class ContextMenuView extends ViewModel {
  items: ActionView[];
  target: ViewModel;

  constructor(options: {
    items: ActionView[];
    target: ViewModel;
    key?: string;
  }) {
    super({ key: options.key });
    this.items = options.items;
    this.target = options.target;
  }

  setItems(items: ActionView[]) {
    this.items = items;
    this.notify();
  }
}
