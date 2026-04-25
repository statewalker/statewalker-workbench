import { type ActionView, ViewModel } from "../core/index.js";

export type LogicVariant = "and" | "or";

export class LogicButtonView extends ViewModel {
  readonly action: ActionView;

  #logicVariant: LogicVariant = "and";
  set logicVariant(value: LogicVariant) {
    this.#logicVariant = value;
    this.notify();
  }
  get logicVariant(): LogicVariant {
    return this.#logicVariant;
  }

  constructor(options: {
    action: ActionView;
    logicVariant?: LogicVariant;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#logicVariant = options.logicVariant ?? "and";
  }

  toggle(): void {
    this.#logicVariant = this.#logicVariant === "and" ? "or" : "and";
    this.notify();
  }
}
