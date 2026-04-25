import { ViewModel } from "../core/index.js";

export type ProgressBarSize = "S" | "M" | "L";
export type ProgressBarLabelPosition = "top" | "side";
export type ProgressBarVariant = "overBackground" | undefined;

export class ProgressBarView extends ViewModel {
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

  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #size: ProgressBarSize = "M";
  set size(value: ProgressBarSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ProgressBarSize {
    return this.#size;
  }

  #labelPosition: ProgressBarLabelPosition = "top";
  set labelPosition(value: ProgressBarLabelPosition) {
    this.#labelPosition = value;
    this.notify();
  }
  get labelPosition(): ProgressBarLabelPosition {
    return this.#labelPosition;
  }

  #showValueLabel: boolean = false;
  set showValueLabel(value: boolean) {
    this.#showValueLabel = value;
    this.notify();
  }
  get showValueLabel(): boolean {
    return this.#showValueLabel;
  }

  #variant: ProgressBarVariant = undefined;
  set variant(value: ProgressBarVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ProgressBarVariant {
    return this.#variant;
  }

  constructor(options?: {
    value?: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    size?: ProgressBarSize;
    labelPosition?: ProgressBarLabelPosition;
    showValueLabel?: boolean;
    variant?: ProgressBarVariant;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value;
    this.#minValue = options?.minValue ?? 0;
    this.#maxValue = options?.maxValue ?? 100;
    this.#label = options?.label;
    this.#size = options?.size ?? "M";
    this.#labelPosition = options?.labelPosition ?? "top";
    this.#showValueLabel = options?.showValueLabel ?? false;
    this.#variant = options?.variant;
  }

  setValue(value: number | undefined): void {
    this.#value = value;
    this.notify();
  }

  get percentage(): number {
    if (this.#value == null) return 0;
    const range = this.#maxValue - this.#minValue;
    if (range === 0) return 0;
    return ((this.#value - this.#minValue) / range) * 100;
  }

  get isIndeterminate(): boolean {
    return this.#value == null;
  }
}
