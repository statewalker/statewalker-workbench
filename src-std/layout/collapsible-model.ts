import type { ViewModel } from "../core/index.js";
import { type ActionModel, ContainerModel } from "../core/index.js";

export class CollapsibleModel extends ContainerModel {
  #isOpen: boolean;
  trigger: ActionModel;

  constructor(options: {
    key?: string;
    children?: ViewModel[];
    isOpen?: boolean;
    trigger: ActionModel;
  }) {
    super({ key: options.key, children: options.children });
    this.#isOpen = options.isOpen ?? false;
    this.trigger = options.trigger;
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  setOpen(open: boolean): void {
    this.#isOpen = open;
    this.notify();
  }

  toggle(): void {
    this.#isOpen = !this.#isOpen;
    this.notify();
  }
}
