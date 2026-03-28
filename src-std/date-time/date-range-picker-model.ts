import { ViewModel } from "../core/index.js";

export type DateRangePickerGranularity = "day" | "hour" | "minute" | "second";

export class DateRangePickerModel extends ViewModel {
  #label: string | undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #startValue: string | undefined;
  set startValue(value: string | undefined) {
    this.#startValue = value;
    this.notify();
  }
  get startValue(): string | undefined {
    return this.#startValue;
  }

  #endValue: string | undefined;
  set endValue(value: string | undefined) {
    this.#endValue = value;
    this.notify();
  }
  get endValue(): string | undefined {
    return this.#endValue;
  }

  #granularity: DateRangePickerGranularity = "day";
  set granularity(value: DateRangePickerGranularity) {
    this.#granularity = value;
    this.notify();
  }
  get granularity(): DateRangePickerGranularity {
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
    startValue?: string;
    endValue?: string;
    granularity?: DateRangePickerGranularity;
    minValue?: string;
    maxValue?: string;
    isDisabled?: boolean;
    isOpen?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#startValue = options?.startValue;
    this.#endValue = options?.endValue;
    this.#granularity = options?.granularity ?? "day";
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isOpen = options?.isOpen ?? false;
  }

  setRange(start: string | undefined, end: string | undefined): void {
    this.#startValue = start;
    this.#endValue = end;
    this.notify();
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }
}
