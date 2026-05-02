import { ContainerView } from "../core/index.js";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems = "stretch" | "start" | "end" | "center" | "baseline";
export type Wrap = boolean | "wrap" | "nowrap" | "wrap-reverse";
export class FlexView extends ContainerView {
  #direction: FlexDirection;
  #wrap: Wrap;
  #gap: string;
  #alignItems: AlignItems;
  #justifyContent: JustifyContent;
  #padding: string;

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    wrap?: Wrap;
    gap?: string;
    alignItems?: AlignItems;
    justifyContent?: JustifyContent;
    padding?: string;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#direction = options?.direction ?? "row";
    this.#wrap = options?.wrap ?? false;
    this.#gap = options?.gap ?? "0";
    this.#alignItems = options?.alignItems ?? "stretch";
    this.#justifyContent = options?.justifyContent ?? "start";
    this.#padding = options?.padding ?? "0";
  }

  get direction(): FlexDirection {
    return this.#direction;
  }
  set direction(value: FlexDirection) {
    this.#direction = value;
    this.notify();
  }

  get wrap(): Wrap {
    return this.#wrap;
  }
  set wrap(value: Wrap) {
    this.#wrap = value;
    this.notify();
  }

  get gap(): string {
    return this.#gap;
  }
  set gap(value: string) {
    this.#gap = value;
    this.notify();
  }

  get alignItems(): AlignItems {
    return this.#alignItems;
  }
  set alignItems(value: AlignItems) {
    this.#alignItems = value;
    this.notify();
  }

  get justifyContent(): JustifyContent {
    return this.#justifyContent;
  }
  set justifyContent(value: JustifyContent) {
    this.#justifyContent = value;
    this.notify();
  }

  get padding(): string {
    return this.#padding;
  }
  set padding(value: string) {
    this.#padding = value;
    this.notify();
  }
}
