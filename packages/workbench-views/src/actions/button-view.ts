import { type ActionView, ViewModel } from "../core/index.js";

export type ButtonSize = "S" | "M" | "L" | "XL";
export type ButtonType = "button" | "submit" | "reset";
export type StaticColor = "white" | "black" | undefined;
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";

export class ButtonView extends ViewModel {
  readonly action: ActionView;

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

  #variant: ButtonVariant = "primary";
  set variant(value: ButtonVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ButtonVariant {
    return this.#variant;
  }

  constructor(options: {
    action: ActionView;
    size?: ButtonSize;
    staticColor?: StaticColor;
    type?: ButtonType;
    isPending?: boolean;
    variant?: ButtonVariant;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#size = options.size ?? "M";
    this.#staticColor = options.staticColor;
    this.#type = options.type ?? "button";
    this.#isPending = options.isPending ?? false;
    this.#variant = options.variant ?? "primary";
  }
}
