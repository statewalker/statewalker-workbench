import { ViewModel } from "../core/index.js";

export type ComboBoxItem = {
  key: string;
  label: string;
  icon?: string;
  section?: string;
};

export class ComboBoxView extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #items: ComboBoxItem[] = [];
  set items(value: ComboBoxItem[]) {
    this.#items = value;
    this.notify();
  }
  get items(): ComboBoxItem[] {
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

  #inputValue = "";
  set inputValue(value: string) {
    this.#inputValue = value;
    this.notify();
  }
  get inputValue(): string {
    return this.#inputValue;
  }

  #allowsCustomValue = false;
  set allowsCustomValue(value: boolean) {
    this.#allowsCustomValue = value;
    this.notify();
  }
  get allowsCustomValue(): boolean {
    return this.#allowsCustomValue;
  }

  #menuTrigger: "focus" | "input" | "manual" = "input";
  set menuTrigger(value: "focus" | "input" | "manual") {
    this.#menuTrigger = value;
    this.notify();
  }
  get menuTrigger(): "focus" | "input" | "manual" {
    return this.#menuTrigger;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    items?: ComboBoxItem[];
    selectedKey?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isQuiet?: boolean;
    errorMessage?: string;
    inputValue?: string;
    allowsCustomValue?: boolean;
    menuTrigger?: "focus" | "input" | "manual";
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
    this.#inputValue = options?.inputValue ?? "";
    this.#allowsCustomValue = options?.allowsCustomValue ?? false;
    this.#menuTrigger = options?.menuTrigger ?? "input";
  }

  setInputValue(value: string): void {
    this.inputValue = value;
  }

  setSelectedKey(key: string | undefined): void {
    this.selectedKey = key;
  }
}
