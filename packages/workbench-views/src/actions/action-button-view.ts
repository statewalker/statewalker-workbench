import { type ActionView, ViewModel } from "../core/index.js";
import type { StaticColor } from "./button-view.js";

export type ActionButtonSize = "XS" | "S" | "M" | "L" | "XL";

export class ActionButtonView extends ViewModel {
  readonly action: ActionView;

  #size: ActionButtonSize = "M";
  set size(value: ActionButtonSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ActionButtonSize {
    return this.#size;
  }

  #isQuiet = false;
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
  get isQuiet(): boolean {
    return this.#isQuiet;
  }

  #staticColor: StaticColor = undefined;
  set staticColor(value: StaticColor) {
    this.#staticColor = value;
    this.notify();
  }
  get staticColor(): StaticColor {
    return this.#staticColor;
  }

  constructor(options: {
    action: ActionView;
    size?: ActionButtonSize;
    isQuiet?: boolean;
    staticColor?: StaticColor;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#size = options.size ?? "M";
    this.#isQuiet = options.isQuiet ?? false;
    this.#staticColor = options.staticColor;
  }
}
