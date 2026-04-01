import { ViewModel } from "../core/index.js";

export class RangeSliderView extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #startValue = 0;
  set startValue(value: number) {
    this.#startValue = value;
    this.notify();
  }
  get startValue(): number {
    return this.#startValue;
  }

  #endValue = 100;
  set endValue(value: number) {
    this.#endValue = value;
    this.notify();
  }
  get endValue(): number {
    return this.#endValue;
  }

  #minValue = 0;
  set minValue(value: number) {
    this.#minValue = value;
    this.notify();
  }
  get minValue(): number {
    return this.#minValue;
  }

  #maxValue = 100;
  set maxValue(value: number) {
    this.#maxValue = value;
    this.notify();
  }
  get maxValue(): number {
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

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    startValue?: number;
    endValue?: number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    isDisabled?: boolean;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#startValue = options?.startValue ?? 0;
    this.#endValue = options?.endValue ?? 100;
    this.#minValue = options?.minValue ?? 0;
    this.#maxValue = options?.maxValue ?? 100;
    this.#step = options?.step ?? 1;
    this.#isDisabled = options?.isDisabled ?? false;
  }

  setRange(start: number, end: number): void {
    this.#startValue = Math.max(this.#minValue, Math.min(start, end));
    this.#endValue = Math.min(this.#maxValue, Math.max(start, end));
    this.notify();
  }
}
