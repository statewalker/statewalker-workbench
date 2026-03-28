import { ViewModel } from "../core/index.js";

export type ColorSwatchSize = "XS" | "S" | "M" | "L";

export class ColorSwatchModel extends ViewModel {
  readonly color: string;

  #size: ColorSwatchSize = "M";
  set size(value: ColorSwatchSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ColorSwatchSize {
    return this.#size;
  }

  constructor(options: {
    color: string;
    size?: ColorSwatchSize;
    key?: string;
  }) {
    super({ key: options.key });
    this.color = options.color;
    this.#size = options.size ?? "M";
  }
}
