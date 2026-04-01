import type { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  action?: ActionView;
}

export class BreadcrumbView extends ViewModel {
  items: BreadcrumbItem[];

  constructor(options: {
    items: BreadcrumbItem[];
    key?: string;
  }) {
    super({ key: options.key });
    this.items = options.items;
  }

  setItems(items: BreadcrumbItem[]) {
    this.items = items;
    this.notify();
  }

  push(item: BreadcrumbItem) {
    this.items = [...this.items, item];
    this.notify();
  }

  popTo(index: number) {
    this.items = this.items.slice(0, index + 1);
    this.notify();
  }
}
