import { ViewModel } from "../core/index.js";

export type SpinnerSize = "S" | "M" | "L";

export class SpinnerView extends ViewModel {
  #size: SpinnerSize = "M";
  set size(value: SpinnerSize) {
    this.#size = value;
    this.notify();
  }
  get size(): SpinnerSize {
    return this.#size;
  }

  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  constructor(options?: {
    size?: SpinnerSize;
    label?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#size = options?.size ?? "M";
    this.#label = options?.label;
  }
}
