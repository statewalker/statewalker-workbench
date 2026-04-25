import type { ViewModel } from "../core/index.js";
import { ContainerView } from "../core/index.js";

export interface AccordionItem {
  key: string;
  title: string;
  content: ViewModel;
  disabled?: boolean;
}

export class AccordionView extends ContainerView {
  #items: AccordionItem[];
  #expandedKeys: Set<string>;
  #allowsMultipleExpanded: boolean;

  constructor(options?: {
    key?: string;
    children?: ViewModel[];
    items?: AccordionItem[];
    expandedKeys?: Set<string>;
    allowsMultipleExpanded?: boolean;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#items = options?.items ?? [];
    this.#expandedKeys = options?.expandedKeys ?? new Set();
    this.#allowsMultipleExpanded = options?.allowsMultipleExpanded ?? false;
  }

  get items(): AccordionItem[] {
    return this.#items;
  }
  set items(value: AccordionItem[]) {
    this.#items = value;
    this.notify();
  }

  get expandedKeys(): Set<string> {
    return this.#expandedKeys;
  }
  set expandedKeys(value: Set<string>) {
    this.#expandedKeys = value;
    this.notify();
  }

  get allowsMultipleExpanded(): boolean {
    return this.#allowsMultipleExpanded;
  }
  set allowsMultipleExpanded(value: boolean) {
    this.#allowsMultipleExpanded = value;
    this.notify();
  }

  toggle(key: string): void {
    const item = this.#items.find((i) => i.key === key);
    if (!item || item.disabled) return;

    const next = new Set(this.#expandedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (!this.#allowsMultipleExpanded) {
        next.clear();
      }
      next.add(key);
    }
    this.#expandedKeys = next;
    this.notify();
  }

  isExpanded(key: string): boolean {
    return this.#expandedKeys.has(key);
  }

  expandAll(): void {
    this.#expandedKeys = new Set(this.#items.filter((i) => !i.disabled).map((i) => i.key));
    this.notify();
  }

  collapseAll(): void {
    this.#expandedKeys = new Set();
    this.notify();
  }
}
