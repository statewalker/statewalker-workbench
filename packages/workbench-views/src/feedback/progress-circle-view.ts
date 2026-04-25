import { ViewModel } from "../core/index.js";

export type ProgressCircleSize = "S" | "M" | "L";
export type ProgressCircleVariant = "overBackground" | undefined;

export class ProgressCircleView extends ViewModel {
  #value: number | undefined = undefined;
  set value(value: number | undefined) {
    this.#value = value;
    this.notify();
  }
  get value(): number | undefined {
    return this.#value;
  }

  #minValue: number = 0;
  set minValue(value: number) {
    this.#minValue = value;
    this.notify();
  }
  get minValue(): number {
    return this.#minValue;
  }

  #maxValue: number = 100;
  set maxValue(value: number) {
    this.#maxValue = value;
    this.notify();
  }
  get maxValue(): number {
    return this.#maxValue;
  }

  #size: ProgressCircleSize = "M";
  set size(value: ProgressCircleSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ProgressCircleSize {
    return this.#size;
  }

  #variant: ProgressCircleVariant = undefined;
  set variant(value: ProgressCircleVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ProgressCircleVariant {
    return this.#variant;
  }

  constructor(options?: {
    value?: number;
    minValue?: number;
    maxValue?: number;
    size?: ProgressCircleSize;
    variant?: ProgressCircleVariant;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value;
    this.#minValue = options?.minValue ?? 0;
    this.#maxValue = options?.maxValue ?? 100;
    this.#size = options?.size ?? "M";
    this.#variant = options?.variant;
  }

  setValue(value: number | undefined): void {
    this.#value = value;
    this.notify();
  }

  get isIndeterminate(): boolean {
    return this.#value == null;
  }
}
