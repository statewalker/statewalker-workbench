import { ContainerView } from "../core/index.js";

export interface ListBoxItem {
  key: string;
  label: string;
  icon?: string;
  description?: string;
}

export type ListBoxSelectionMode = "none" | "single" | "multiple";

export class ListBoxView extends ContainerView<ListBoxItem> {
  #items: ListBoxItem[] = [];
  set items(value: ListBoxItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): ListBoxItem[] {
    return this.#items;
  }

  #selectionMode: ListBoxSelectionMode = "none";
  set selectionMode(value: ListBoxSelectionMode) {
    this.#selectionMode = value;
    this.notify();
  }
  get selectionMode(): ListBoxSelectionMode {
    return this.#selectionMode;
  }

  #selectedKeys: Set<string> = new Set();
  set selectedKeys(value: Set<string>) {
    this.#selectedKeys = value;
    this.notify();
  }
  get selectedKeys(): Set<string> {
    return this.#selectedKeys;
  }

  #disabledKeys: Set<string> = new Set();
  set disabledKeys(value: Set<string>) {
    this.#disabledKeys = value;
    this.notify();
  }
  get disabledKeys(): Set<string> {
    return this.#disabledKeys;
  }

  constructor(options?: {
    items?: ListBoxItem[];
    selectionMode?: ListBoxSelectionMode;
    selectedKeys?: Set<string>;
    disabledKeys?: Set<string>;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#items = options?.items ?? [];
    this.#selectionMode = options?.selectionMode ?? "none";
    this.#selectedKeys = options?.selectedKeys ?? new Set();
    this.#disabledKeys = options?.disabledKeys ?? new Set();
  }

  setItems(items: ListBoxItem[]): void {
    this.#items = items;
    this.notify();
  }

  toggleSelection(key: string): void {
    if (this.#disabledKeys.has(key)) return;
    const next = new Set(this.#selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (this.#selectionMode === "single") {
        next.clear();
      }
      next.add(key);
    }
    this.#selectedKeys = next;
    this.notify();
  }

  clearSelection(): void {
    this.#selectedKeys = new Set();
    this.notify();
  }
}
