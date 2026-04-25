import { type ActionView, ViewModel } from "../core/index.js";

export class LinkView extends ViewModel {
  action: ActionView;
  #variant: "primary" | "secondary" | "overBackground";
  #isQuiet: boolean;

  constructor(options: {
    key?: string;
    action: ActionView;
    variant?: "primary" | "secondary" | "overBackground";
    isQuiet?: boolean;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#variant = options.variant ?? "primary";
    this.#isQuiet = options.isQuiet ?? false;
  }

  get variant(): "primary" | "secondary" | "overBackground" {
    return this.#variant;
  }
  set variant(value: "primary" | "secondary" | "overBackground") {
    this.#variant = value;
    this.notify();
  }

  get isQuiet(): boolean {
    return this.#isQuiet;
  }
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
}
