import { ViewModel } from "../core/index.js";

export type ContextualHelpVariant = "help" | "info";

export class ContextualHelpModel extends ViewModel {
  #variant: ContextualHelpVariant;
  set variant(value: ContextualHelpVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ContextualHelpVariant {
    return this.#variant;
  }

  #title: string | undefined;
  set title(value: string | undefined) {
    this.#title = value;
    this.notify();
  }
  get title(): string | undefined {
    return this.#title;
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
    key?: string;
    variant?: ContextualHelpVariant;
    title?: string;
    content: string | ViewModel;
  }) {
    super({ key: options.key });
    this.#variant = options.variant ?? "info";
    this.#title = options.title;
    this.#content = options.content;
  }
}
