import { ContainerView } from "../core/index.js";

export interface ListItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
}

export type ListViewSelectionMode = "none" | "single" | "multiple";
export type ListViewDensity = "compact" | "regular" | "spacious";
export type ListViewOverflowMode = "wrap" | "truncate";

export class ListView extends ContainerView<ListItem> {
  #items: ListItem[] = [];
  set items(value: ListItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): ListItem[] {
    return this.#items;
  }

  #selectionMode: ListViewSelectionMode = "none";
  set selectionMode(value: ListViewSelectionMode) {
    this.#selectionMode = value;
    this.notify();
  }
  get selectionMode(): ListViewSelectionMode {
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

  #density: ListViewDensity = "regular";
  set density(value: ListViewDensity) {
    this.#density = value;
    this.notify();
  }
  get density(): ListViewDensity {
    return this.#density;
  }

  #overflowMode: ListViewOverflowMode = "truncate";
  set overflowMode(value: ListViewOverflowMode) {
    this.#overflowMode = value;
    this.notify();
  }
  get overflowMode(): ListViewOverflowMode {
    return this.#overflowMode;
  }

  constructor(options?: {
    items?: ListItem[];
    selectionMode?: ListViewSelectionMode;
    selectedKeys?: Set<string>;
    disabledKeys?: Set<string>;
    density?: ListViewDensity;
    overflowMode?: ListViewOverflowMode;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#items = options?.items ?? [];
    this.#selectionMode = options?.selectionMode ?? "none";
    this.#selectedKeys = options?.selectedKeys ?? new Set();
    this.#disabledKeys = options?.disabledKeys ?? new Set();
    this.#density = options?.density ?? "regular";
    this.#overflowMode = options?.overflowMode ?? "truncate";
  }

  setItems(items: ListItem[]): void {
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
