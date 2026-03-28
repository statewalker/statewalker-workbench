import { ViewModel } from "../core/index.js";

export type AvatarSize =
  | "50"
  | "75"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700";

export class AvatarModel extends ViewModel {
  readonly src: string;
  readonly alt: string;

  #size: AvatarSize = "100";
  set size(value: AvatarSize) {
    this.#size = value;
    this.notify();
  }
  get size(): AvatarSize {
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

  constructor(options: {
    src: string;
    alt: string;
    size?: AvatarSize;
    isDisabled?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.src = options.src;
    this.alt = options.alt;
    this.#size = options.size ?? "100";
    this.#isDisabled = options.isDisabled ?? false;
  }

  setSrc(src: string): void {
    (this as { src: string }).src = src;
    this.notify();
  }
}
