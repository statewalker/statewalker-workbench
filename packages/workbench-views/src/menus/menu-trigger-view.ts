import { type ActionView, ViewModel } from "../core/index.js";
import type { MenuView } from "./menu-view.js";

export class MenuTriggerView extends ViewModel {
  trigger: ActionView;
  menu: MenuView;
  #isOpen: boolean;

  constructor(options: {
    key?: string;
    trigger: ActionView;
    menu: MenuView;
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
