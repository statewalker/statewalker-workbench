import { ViewModel } from "../core/index.js";

export type DatePickerGranularity = "day" | "hour" | "minute" | "second";

export class DatePickerView extends ViewModel {
  #label: string | undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value: string | undefined;
  set value(value: string | undefined) {
    this.#value = value;
    this.notify();
  }
  get value(): string | undefined {
    return this.#value;
  }

  #granularity: DatePickerGranularity = "day";
  set granularity(value: DatePickerGranularity) {
    this.#granularity = value;
    this.notify();
  }
  get granularity(): DatePickerGranularity {
    return this.#granularity;
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

  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
  }

  #errorMessage: string | undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  #description: string | undefined;
  set description(value: string | undefined) {
    this.#description = value;
    this.notify();
  }
  get description(): string | undefined {
    return this.#description;
  }

  #isOpen = false;
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }
  get isOpen(): boolean {
    return this.#isOpen;
  }

  constructor(options?: {
    label?: string;
    value?: string;
    granularity?: DatePickerGranularity;
    minValue?: string;
    maxValue?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    errorMessage?: string;
    description?: string;
    isOpen?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value;
    this.#granularity = options?.granularity ?? "day";
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#isRequired = options?.isRequired ?? false;
    this.#errorMessage = options?.errorMessage;
    this.#description = options?.description;
    this.#isOpen = options?.isOpen ?? false;
  }

  setValue(value: string | undefined): void {
    this.value = value;
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
