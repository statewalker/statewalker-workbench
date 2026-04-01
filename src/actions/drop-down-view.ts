import { ViewModel } from "../core/view-model.js";
import { ActionView, type ActionViewConfig } from "./action-view.js";

export class DropDownModel extends ViewModel {
  label: string;
  icon: string | undefined;
  items: ActionView[];
  open: boolean;

  constructor(options: {
    label: string;
    icon?: string;
    items: ActionViewConfig[];
    key?: string;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.icon = options.icon;
    this.items = options.items.map((item) => new ActionView(item));
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
    this.notify();
  }

  close() {
    this.open = false;
    this.notify();
  }
}
