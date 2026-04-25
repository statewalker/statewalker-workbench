import { ViewModel } from "../core/index.js";

export type MeterSize = "S" | "M" | "L";
export type MeterVariant = "positive" | "warning" | "critical" | "informative";

export class MeterView extends ViewModel {
  #value: number = 0;
  set value(value: number) {
    this.#value = value;
    this.notify();
  }
  get value(): number {
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

  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #size: MeterSize = "M";
  set size(value: MeterSize) {
    this.#size = value;
    this.notify();
  }
  get size(): MeterSize {
    return this.#size;
  }

  #variant: MeterVariant = "informative";
  set variant(value: MeterVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): MeterVariant {
    return this.#variant;
  }

  constructor(options?: {
    value?: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    size?: MeterSize;
    variant?: MeterVariant;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value ?? 0;
    this.#minValue = options?.minValue ?? 0;
    this.#maxValue = options?.maxValue ?? 100;
    this.#label = options?.label;
    this.#size = options?.size ?? "M";
    this.#variant = options?.variant ?? "informative";
  }

  setValue(value: number): void {
    this.#value = value;
    this.notify();
  }

  get percentage(): number {
    const range = this.#maxValue - this.#minValue;
    if (range === 0) return 0;
    return ((this.#value - this.#minValue) / range) * 100;
  }
}
