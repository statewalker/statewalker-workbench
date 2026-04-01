import { ViewModel } from "../core/view-model.js";

export interface AccordionItem {
  key: string;
  title: string;
  content: ViewModel;
  disabled?: boolean;
}

export class AccordionView extends ViewModel {
  items: AccordionItem[];
  expandedKeys: Set<string>;
  multiple: boolean;

  constructor(options: {
    items: AccordionItem[];
    expandedKeys?: string[];
    multiple?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.items = options.items;
    this.expandedKeys = new Set(options.expandedKeys ?? []);
    this.multiple = options.multiple ?? false;
  }

  toggle(key: string) {
    const item = this.items.find((i) => i.key === key);
    if (item?.disabled) return;

    if (this.expandedKeys.has(key)) {
      this.expandedKeys.delete(key);
    } else {
      if (!this.multiple) {
        this.expandedKeys.clear();
      }
      this.expandedKeys.add(key);
    }
    this.notify();
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys.has(key);
  }

  expandAll() {
    for (const item of this.items) {
      if (!item.disabled) {
        this.expandedKeys.add(item.key);
      }
    }
    this.notify();
  }

  collapseAll() {
    this.expandedKeys.clear();
    this.notify();
  }
}
