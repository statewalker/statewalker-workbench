import { type ActionModel, ViewModel } from "../core/index.js";

export type ActionButtonSize = "XS" | "S" | "M" | "L" | "XL";
export type StaticColor = "white" | "black" | undefined;

export class ActionButtonModel extends ViewModel {
  readonly action: ActionModel;

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
    action: ActionModel;
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
