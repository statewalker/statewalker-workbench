import { type ActionModel, ViewModel } from "../core/index.js";
import type { MenuModel } from "./menu-model.js";

export class MenuTriggerModel extends ViewModel {
  trigger: ActionModel;
  menu: MenuModel;
  #isOpen: boolean;

  constructor(options: {
    key?: string;
    trigger: ActionModel;
    menu: MenuModel;
    isOpen?: boolean;
  }) {
    super({ key: options.key });
    this.trigger = options.trigger;
    this.menu = options.menu;
    this.#isOpen = options.isOpen ?? false;
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
