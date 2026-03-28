import type { ActionModel } from "../core/index.js";
import { ViewModel } from "../core/index.js";

export interface BreadcrumbItem {
  key: string;
  label: string;
  action?: ActionModel;
}

export class BreadcrumbModel extends ViewModel {
  #items: BreadcrumbItem[];
  #size: "S" | "M" | "L";
  #isMultiline: boolean;

  constructor(options?: {
    key?: string;
    items?: BreadcrumbItem[];
    size?: "S" | "M" | "L";
    isMultiline?: boolean;
  }) {
    super({ key: options?.key });
    this.#items = options?.items ?? [];
    this.#size = options?.size ?? "M";
    this.#isMultiline = options?.isMultiline ?? false;
  }

  get items(): BreadcrumbItem[] {
    return this.#items;
  }
  set items(value: BreadcrumbItem[]) {
    this.#items = value;
    this.notify();
  }

  get size(): "S" | "M" | "L" {
    return this.#size;
  }
  set size(value: "S" | "M" | "L") {
    this.#size = value;
    this.notify();
  }

  get isMultiline(): boolean {
    return this.#isMultiline;
  }
  set isMultiline(value: boolean) {
    this.#isMultiline = value;
    this.notify();
  }

  setItems(items: BreadcrumbItem[]): void {
    this.#items = items;
    this.notify();
  }

  push(item: BreadcrumbItem): void {
    this.#items = [...this.#items, item];
    this.notify();
  }

  popTo(index: number): void {
    this.#items = this.#items.slice(0, index + 1);
    this.notify();
  }
}
