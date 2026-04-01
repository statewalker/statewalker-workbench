import { ViewModel } from "../core/index.js";

export type ImageObjectFit = "contain" | "cover" | "fill" | "none";

export class ImageModel extends ViewModel {
  readonly src: string;
  readonly alt: string;

  #objectFit: ImageObjectFit = "cover";
  set objectFit(value: ImageObjectFit) {
    this.#objectFit = value;
    this.notify();
  }
  get objectFit(): ImageObjectFit {
    return this.#objectFit;
  }

  #width: string | undefined;
  set width(value: string | undefined) {
    this.#width = value;
    this.notify();
  }
  get width(): string | undefined {
    return this.#width;
  }

  #height: string | undefined;
  set height(value: string | undefined) {
    this.#height = value;
    this.notify();
  }
  get height(): string | undefined {
    return this.#height;
  }

  constructor(options: {
    src: string;
    alt: string;
    objectFit?: ImageObjectFit;
    width?: string;
    height?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.src = options.src;
    this.alt = options.alt;
    this.#objectFit = options.objectFit ?? "cover";
    this.#width = options.width;
    this.#height = options.height;
  }

  setSrc(src: string): void {
    (this as { src: string }).src = src;
    this.notify();
  }
}
