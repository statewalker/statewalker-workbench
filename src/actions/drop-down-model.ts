import { ViewModel } from "../core/view-model.js";
import { type ActionConfig, ActionModel } from "./action-model.js";

export class DropDownModel extends ViewModel {
  label: string;
  icon: string | undefined;
  items: ActionModel[];
  open: boolean;

  constructor(options: {
    label: string;
    icon?: string;
    items: ActionConfig[];
    key?: string;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.icon = options.icon;
    this.items = options.items.map((item) => new ActionModel(item));
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
