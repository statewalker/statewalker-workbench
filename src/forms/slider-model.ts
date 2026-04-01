import { ViewModel } from "../core/index.js";

export class SliderModel extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value = 0;
  set value(value: number) {
    this.#value = value;
    this.notify();
  }
  get value(): number {
    return this.#value;
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

  #isFilled = false;
  set isFilled(value: boolean) {
    this.#isFilled = value;
    this.notify();
  }
  get isFilled(): boolean {
    return this.#isFilled;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  #orientation: "horizontal" | "vertical" = "horizontal";
  set orientation(value: "horizontal" | "vertical") {
    this.#orientation = value;
    this.notify();
  }
  get orientation(): "horizontal" | "vertical" {
    return this.#orientation;
  }

  #formatOptions: Intl.NumberFormatOptions | undefined = undefined;
  set formatOptions(value: Intl.NumberFormatOptions | undefined) {
    this.#formatOptions = value;
    this.notify();
  }
  get formatOptions(): Intl.NumberFormatOptions | undefined {
    return this.#formatOptions;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    value?: number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    isFilled?: boolean;
    isDisabled?: boolean;
    orientation?: "horizontal" | "vertical";
    formatOptions?: Intl.NumberFormatOptions;
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value ?? 0;
    this.#minValue = options?.minValue ?? 0;
    this.#maxValue = options?.maxValue ?? 100;
    this.#step = options?.step ?? 1;
    this.#isFilled = options?.isFilled ?? false;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#orientation = options?.orientation ?? "horizontal";
    this.#formatOptions = options?.formatOptions;
  }

  setValue(value: number): void {
    const clamped = Math.min(this.#maxValue, Math.max(this.#minValue, value));
    this.value = clamped;
  }
}
