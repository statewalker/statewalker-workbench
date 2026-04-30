import { ContainerView } from "../core/index.js";

export class FlexView extends ContainerView {
  #direction: "row" | "column" | "row-reverse" | "column-reverse";
  #wrap: boolean | "wrap" | "nowrap" | "wrap-reverse";
  #gap: string;
  #alignItems: string;
  #justifyContent: string;
  #padding: string;

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    wrap?: boolean | "wrap" | "nowrap" | "wrap-reverse";
    gap?: string;
    alignItems?: string;
    justifyContent?: string;
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

  get direction(): "row" | "column" | "row-reverse" | "column-reverse" {
    return this.#direction;
  }
  set direction(value: "row" | "column" | "row-reverse" | "column-reverse") {
    this.#direction = value;
    this.notify();
  }

  get wrap(): boolean | "wrap" | "nowrap" | "wrap-reverse" {
    return this.#wrap;
  }
  set wrap(value: boolean | "wrap" | "nowrap" | "wrap-reverse") {
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

  get alignItems(): string {
    return this.#alignItems;
  }
  set alignItems(value: string) {
    this.#alignItems = value;
    this.notify();
  }

  get justifyContent(): string {
    return this.#justifyContent;
  }
  set justifyContent(value: string) {
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
