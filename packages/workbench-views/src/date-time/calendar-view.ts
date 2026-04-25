import { ViewModel } from "../core/index.js";

export class CalendarView extends ViewModel {
  #value: string | undefined;
  set value(value: string | undefined) {
    this.#value = value;
    this.notify();
  }
  get value(): string | undefined {
    return this.#value;
  }

  #minValue: string | undefined;
  set minValue(value: string | undefined) {
    this.#minValue = value;
    this.notify();
  }
  get minValue(): string | undefined {
    return this.#minValue;
  }

  #maxValue: string | undefined;
  set maxValue(value: string | undefined) {
    this.#maxValue = value;
    this.notify();
  }
  get maxValue(): string | undefined {
    return this.#maxValue;
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

  #focusedValue: string | undefined;
  set focusedValue(value: string | undefined) {
    this.#focusedValue = value;
    this.notify();
  }
  get focusedValue(): string | undefined {
    return this.#focusedValue;
  }

  constructor(options?: {
    value?: string;
    minValue?: string;
    maxValue?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    focusedValue?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value;
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#focusedValue = options?.focusedValue;
  }

  setValue(value: string | undefined): void {
    this.value = value;
  }
}
