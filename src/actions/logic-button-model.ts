import { type ActionModel, ViewModel } from "../core/index.js";

export type LogicVariant = "and" | "or";

export class LogicButtonModel extends ViewModel {
  readonly action: ActionModel;

  #logicVariant: LogicVariant = "and";
  set logicVariant(value: LogicVariant) {
    this.#logicVariant = value;
    this.notify();
  }
  get logicVariant(): LogicVariant {
    return this.#logicVariant;
  }

  constructor(options: {
    action: ActionModel;
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
