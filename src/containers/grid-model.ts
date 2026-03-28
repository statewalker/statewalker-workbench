import { ViewModel } from "../core/view-model.js";

export class GridModel extends ViewModel {
  columns: string;
  gap: string;
  padding: string;
  items: ViewModel[];

  constructor(options: {
    columns?: string;
    gap?: string;
    padding?: string;
    items?: ViewModel[];
    key?: string;
  }) {
    super({ key: options.key });
    this.columns = options.columns ?? "repeat(auto-fit, minmax(200px, 1fr))";
    this.gap = options.gap ?? "1rem";
    this.padding = options.padding ?? "0";
    this.items = options.items ?? [];
  }

  addItem(item: ViewModel) {
    this.items = [...this.items, item];
    this.notify();
  }

  removeItem(key: string) {
    this.items = this.items.filter((i) => i.key !== key);
    this.notify();
  }

  setItems(items: ViewModel[]) {
    this.items = items;
    this.notify();
  }
}
