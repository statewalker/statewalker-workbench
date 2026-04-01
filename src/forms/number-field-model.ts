import { ViewModel } from "../core/index.js";

export class NumberFieldModel extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value: number | undefined = undefined;
  set value(value: number | undefined) {
    this.#value = value;
    this.notify();
  }
  get value(): number | undefined {
    return this.#value;
  }

  #minValue: number | undefined = undefined;
  set minValue(value: number | undefined) {
    this.#minValue = value;
    this.notify();
  }
  get minValue(): number | undefined {
    return this.#minValue;
  }

  #maxValue: number | undefined = undefined;
  set maxValue(value: number | undefined) {
    this.#maxValue = value;
    this.notify();
  }
  get maxValue(): number | undefined {
    return this.#maxValue;
  }

  #step = 1;
  set step(value: number) {
    this.#step = value;
    this.notify();
  }
  get step(): number {
    return this.#step;
  }

  #formatOptions: Intl.NumberFormatOptions | undefined = undefined;
  set formatOptions(value: Intl.NumberFormatOptions | undefined) {
    this.#formatOptions = value;
    this.notify();
  }
  get formatOptions(): Intl.NumberFormatOptions | undefined {
    return this.#formatOptions;
  }

  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
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

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  #description: string | undefined = undefined;
  set description(value: string | undefined) {
    this.#description = value;
    this.notify();
  }
  get description(): string | undefined {
    return this.#description;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    value?: number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    formatOptions?: Intl.NumberFormatOptions;
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    errorMessage?: string;
    description?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value;
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#step = options?.step ?? 1;
    this.#formatOptions = options?.formatOptions;
    this.#isRequired = options?.isRequired ?? false;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#errorMessage = options?.errorMessage;
    this.#description = options?.description;
  }

  setValue(value: number | undefined): void {
    this.value = value;
  }
}
