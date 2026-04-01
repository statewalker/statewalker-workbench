import { ViewModel } from "../core/index.js";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export class SkeletonView extends ViewModel {
  #variant: SkeletonVariant = "rectangular";
  set variant(value: SkeletonVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): SkeletonVariant {
    return this.#variant;
  }

  #width: string | undefined = undefined;
  set width(value: string | undefined) {
    this.#width = value;
    this.notify();
  }
  get width(): string | undefined {
    return this.#width;
  }

  #height: string | undefined = undefined;
  set height(value: string | undefined) {
    this.#height = value;
    this.notify();
  }
  get height(): string | undefined {
    return this.#height;
  }

  constructor(options?: {
    variant?: SkeletonVariant;
    width?: string;
    height?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#variant = options?.variant ?? "rectangular";
    this.#width = options?.width;
    this.#height = options?.height;
  }
}
