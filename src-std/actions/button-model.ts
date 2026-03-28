import { type ActionModel, ViewModel } from "../core/index.js";

export type ButtonSize = "S" | "M" | "L" | "XL";
export type ButtonType = "button" | "submit" | "reset";
export type StaticColor = "white" | "black" | undefined;

export class ButtonModel extends ViewModel {
  readonly action: ActionModel;

  #size: ButtonSize = "M";
  set size(value: ButtonSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ButtonSize {
    return this.#size;
  }

  #staticColor: StaticColor = undefined;
  set staticColor(value: StaticColor) {
    this.#staticColor = value;
    this.notify();
  }
  get staticColor(): StaticColor {
    return this.#staticColor;
  }

  #type: ButtonType = "button";
  set type(value: ButtonType) {
    this.#type = value;
    this.notify();
  }
  get type(): ButtonType {
    return this.#type;
  }

  #isPending = false;
  set isPending(value: boolean) {
    this.#isPending = value;
    this.notify();
  }
  get isPending(): boolean {
    return this.#isPending;
  }

  constructor(options: {
    action: ActionModel;
    size?: ButtonSize;
    staticColor?: StaticColor;
    type?: ButtonType;
    isPending?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#size = options.size ?? "M";
    this.#staticColor = options.staticColor;
    this.#type = options.type ?? "button";
    this.#isPending = options.isPending ?? false;
  }
}
