import { ViewModel } from "../core/index.js";

export class DividerView extends ViewModel {
  #orientation: "horizontal" | "vertical";
  #size: "S" | "M" | "L";

  constructor(options?: {
    key?: string;
    orientation?: "horizontal" | "vertical";
    size?: "S" | "M" | "L";
  }) {
    super({ key: options?.key });
    this.#orientation = options?.orientation ?? "horizontal";
    this.#size = options?.size ?? "M";
  }

  get orientation(): "horizontal" | "vertical" {
    return this.#orientation;
  }
  set orientation(value: "horizontal" | "vertical") {
    this.#orientation = value;
    this.notify();
  }

  get size(): "S" | "M" | "L" {
    return this.#size;
  }
  set size(value: "S" | "M" | "L") {
    this.#size = value;
    this.notify();
  }
}
