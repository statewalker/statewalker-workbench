import { ViewModel } from "../core/index.js";

export type ToggleGroupItem = {
  key: string;
  label?: string;
  icon?: string;
  isDisabled?: boolean;
};

export type ToggleGroupSelectionMode = "single" | "multiple";

export class ToggleGroupView extends ViewModel {
  #type: ToggleGroupSelectionMode;
  set type(value: ToggleGroupSelectionMode) {
    this.#type = value;
    this.notify();
  }
  get type(): ToggleGroupSelectionMode {
    return this.#type;
  }

  #items: ToggleGroupItem[];
  set items(value: ToggleGroupItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): ToggleGroupItem[] {
    return this.#items;
  }

  #selectedKeys: Set<string>;
  set selectedKeys(value: Set<string>) {
    this.#selectedKeys = value;
    this.notify();
  }
  get selectedKeys(): Set<string> {
    return this.#selectedKeys;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  constructor(options?: {
    key?: string;
    type?: ToggleGroupSelectionMode;
    items?: ToggleGroupItem[];
    selectedKeys?: Iterable<string>;
    isDisabled?: boolean;
  }) {
    super({ key: options?.key });
    this.#type = options?.type ?? "single";
    this.#items = options?.items ?? [];
    this.#selectedKeys = new Set(options?.selectedKeys ?? []);
    this.#isDisabled = options?.isDisabled ?? false;
  }

  setSelected(keys: Iterable<string>): void {
    this.selectedKeys = new Set(keys);
  }

  toggle(key: string): void {
    const next = new Set(this.#selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (this.#type === "single") next.clear();
      next.add(key);
    }
    this.selectedKeys = next;
  }
}
