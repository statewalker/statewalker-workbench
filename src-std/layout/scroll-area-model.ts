import { ContainerModel } from "../core/index.js";

export class ScrollAreaModel extends ContainerModel {
  #orientation: "horizontal" | "vertical" | "both";
  #maxHeight: string | undefined;

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    orientation?: "horizontal" | "vertical" | "both";
    maxHeight?: string;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#orientation = options?.orientation ?? "vertical";
    this.#maxHeight = options?.maxHeight;
  }

  get orientation(): "horizontal" | "vertical" | "both" {
    return this.#orientation;
  }
  set orientation(value: "horizontal" | "vertical" | "both") {
    this.#orientation = value;
    this.notify();
  }

  get maxHeight(): string | undefined {
    return this.#maxHeight;
  }
  set maxHeight(value: string | undefined) {
    this.#maxHeight = value;
    this.notify();
  }
}
