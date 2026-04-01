import { ViewModel } from "../core/index.js";

export class SearchFieldModel extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value = "";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
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

  #isQuiet = false;
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
  get isQuiet(): boolean {
    return this.#isQuiet;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isQuiet?: boolean;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value ?? "";
    this.#placeholder = options?.placeholder;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isQuiet = options?.isQuiet ?? false;
  }

  setValue(value: string): void {
    this.value = value;
  }

  clear(): void {
    this.value = "";
  }
}
