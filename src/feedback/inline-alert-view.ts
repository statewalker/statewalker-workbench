import { ViewModel } from "../core/index.js";

export type InlineAlertVariant =
  | "informative"
  | "positive"
  | "notice"
  | "negative";

export class InlineAlertView extends ViewModel {
  #variant: InlineAlertVariant = "informative";
  set variant(value: InlineAlertVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): InlineAlertVariant {
    return this.#variant;
  }

  #header: string | undefined = undefined;
  set header(value: string | undefined) {
    this.#header = value;
    this.notify();
  }
  get header(): string | undefined {
    return this.#header;
  }

  #content: string | ViewModel;
  set content(value: string | ViewModel) {
    this.#content = value;
    this.notify();
  }
  get content(): string | ViewModel {
    return this.#content;
  }

  constructor(options: {
    content: string | ViewModel;
    variant?: InlineAlertVariant;
    header?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.#content = options.content;
    this.#variant = options.variant ?? "informative";
    this.#header = options.header;
  }
}
