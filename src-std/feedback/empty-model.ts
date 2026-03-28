import { type ActionModel, ViewModel } from "../core/index.js";

export class EmptyModel extends ViewModel {
  #icon: string | undefined = undefined;
  set icon(value: string | undefined) {
    this.#icon = value;
    this.notify();
  }
  get icon(): string | undefined {
    return this.#icon;
  }

  #heading: string;
  set heading(value: string) {
    this.#heading = value;
    this.notify();
  }
  get heading(): string {
    return this.#heading;
  }

  #description: string | undefined = undefined;
  set description(value: string | undefined) {
    this.#description = value;
    this.notify();
  }
  get description(): string | undefined {
    return this.#description;
  }

  #action: ActionModel | undefined = undefined;
  set action(value: ActionModel | undefined) {
    this.#action = value;
    this.notify();
  }
  get action(): ActionModel | undefined {
    return this.#action;
  }

  constructor(options: {
    heading: string;
    icon?: string;
    description?: string;
    action?: ActionModel;
    key?: string;
  }) {
    super({ key: options.key });
    this.#heading = options.heading;
    this.#icon = options.icon;
    this.#description = options.description;
    this.#action = options.action;
  }
}
