import { ViewModel } from "../core/index.js";

export type PickerItem = {
  key: string;
  label: string;
  icon?: string;
  section?: string;
};

export class PickerModel extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #items: PickerItem[] = [];
  set items(value: PickerItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): PickerItem[] {
    return this.#items;
  }

  #selectedKey: string | undefined = undefined;
  set selectedKey(value: string | undefined) {
    this.#selectedKey = value;
    this.notify();
  }
  get selectedKey(): string | undefined {
    return this.#selectedKey;
  }

  #placeholder: string | undefined = undefined;
  set placeholder(value: string | undefined) {
    this.#placeholder = value;
    this.notify();
  }
  get placeholder(): string | undefined {
    return this.#placeholder;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
  }

  #isQuiet = false;
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
  get isQuiet(): boolean {
    return this.#isQuiet;
  }

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    items?: PickerItem[];
    selectedKey?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isQuiet?: boolean;
    errorMessage?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#items = options?.items ?? [];
    this.#selectedKey = options?.selectedKey;
    this.#placeholder = options?.placeholder;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isRequired = options?.isRequired ?? false;
    this.#isQuiet = options?.isQuiet ?? false;
    this.#errorMessage = options?.errorMessage;
  }

  setSelectedKey(key: string | undefined): void {
    this.selectedKey = key;
  }

  setItems(items: PickerItem[]): void {
    this.items = items;
  }
}
