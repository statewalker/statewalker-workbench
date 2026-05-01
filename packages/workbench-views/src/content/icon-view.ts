import { ViewModel } from "../core/index.js";

export type IconSize = "S" | "M" | "L" | "XL";

export class IconView extends ViewModel {
  #name: string;
  set name(value: string) {
    this.#name = value;
    this.notify();
  }
  get name(): string {
    return this.#name;
  }

  #size: IconSize = "M";
  set size(value: IconSize) {
    this.#size = value;
    this.notify();
  }
  get size(): IconSize {
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

  constructor(options: {
    name: string;
    size?: IconSize;
    label?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.#name = options.name;
    this.#size = options.size ?? "M";
    this.#label = options.label;
  }
}
