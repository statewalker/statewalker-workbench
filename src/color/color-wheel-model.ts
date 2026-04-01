import { ViewModel } from "../core/index.js";

export class ColorWheelModel extends ViewModel {
  #value = "#ff0000";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #size = 200;
  set size(value: number) {
    this.#size = value;
    this.notify();
  }
  get size(): number {
    return this.#size;
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
    value?: string;
    size?: number;
    isDisabled?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value ?? "#ff0000";
    this.#size = options?.size ?? 200;
    this.#isDisabled = options?.isDisabled ?? false;
  }

  setValue(value: string): void {
    this.value = value;
  }
}
