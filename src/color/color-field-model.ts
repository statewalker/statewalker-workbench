import { ViewModel } from "../core/index.js";

export class ColorFieldModel extends ViewModel {
  #label: string | undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value = "#000000";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  #isReadOnly = false;
  set isReadOnly(value: boolean) {
    this.#isReadOnly = value;
    this.notify();
  }
  get isReadOnly(): boolean {
    return this.#isReadOnly;
  }

  constructor(options?: {
    label?: string;
    value?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value ?? "#000000";
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
  }

  setValue(value: string): void {
    this.value = value;
  }
}
