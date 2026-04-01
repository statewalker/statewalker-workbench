import { ViewModel } from "../core/index.js";

export type TimeGranularity = "hour" | "minute" | "second";
export type HourCycle = 12 | 24;

export class TimeFieldModel extends ViewModel {
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

  #granularity: TimeGranularity = "minute";
  set granularity(value: TimeGranularity) {
    this.#granularity = value;
    this.notify();
  }
  get granularity(): TimeGranularity {
    return this.#granularity;
  }

  #hourCycle: HourCycle = 24;
  set hourCycle(value: HourCycle) {
    this.#hourCycle = value;
    this.notify();
  }
  get hourCycle(): HourCycle {
    return this.#hourCycle;
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

  constructor(options?: {
    label?: string;
    value?: string;
    granularity?: TimeGranularity;
    hourCycle?: HourCycle;
    minValue?: string;
    maxValue?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    errorMessage?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value;
    this.#granularity = options?.granularity ?? "minute";
    this.#hourCycle = options?.hourCycle ?? 24;
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#isRequired = options?.isRequired ?? false;
    this.#errorMessage = options?.errorMessage;
  }

  setValue(value: string | undefined): void {
    this.value = value;
  }
}
