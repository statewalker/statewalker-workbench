import { ViewModel } from "../core/index.js";

export class RangeCalendarView extends ViewModel {
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

  constructor(options?: {
    startValue?: string;
    endValue?: string;
    minValue?: string;
    maxValue?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#startValue = options?.startValue;
    this.#endValue = options?.endValue;
    this.#minValue = options?.minValue;
    this.#maxValue = options?.maxValue;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
  }

  setRange(start: string | undefined, end: string | undefined): void {
    this.#startValue = start;
    this.#endValue = end;
    this.notify();
  }
}
