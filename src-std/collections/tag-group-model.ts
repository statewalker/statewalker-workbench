import { ContainerModel } from "../core/index.js";

export interface TagItem {
  key: string;
  label: string;
  icon?: string;
}

export class TagGroupModel extends ContainerModel<TagItem> {
  #items: TagItem[] = [];
  set items(value: TagItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): TagItem[] {
    return this.#items;
  }

  #maxRows: number | undefined = undefined;
  set maxRows(value: number | undefined) {
    this.#maxRows = value;
    this.notify();
  }
  get maxRows(): number | undefined {
    return this.#maxRows;
  }

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  constructor(options?: {
    items?: TagItem[];
    maxRows?: number;
    errorMessage?: string;
    label?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#items = options?.items ?? [];
    this.#maxRows = options?.maxRows;
    this.#errorMessage = options?.errorMessage;
    this.#label = options?.label;
  }

  setItems(items: TagItem[]): void {
    this.#items = items;
    this.notify();
  }

  removeItem(key: string): void {
    this.#items = this.#items.filter((item) => item.key !== key);
    this.notify();
  }
}
