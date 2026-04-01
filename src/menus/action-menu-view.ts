import { type ActionView, ViewModel } from "../core/index.js";
import type { MenuItemView } from "./menu-view.js";

export class ActionMenuView extends ViewModel {
  action: ActionView;
  #items: MenuItemView[];
  #isOpen: boolean;
  #isQuiet: boolean;

  constructor(options: {
    key?: string;
    action: ActionView;
    items?: MenuItemView[];
    isOpen?: boolean;
    isQuiet?: boolean;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#items = options.items ?? [];
    this.#isOpen = options.isOpen ?? false;
    this.#isQuiet = options.isQuiet ?? false;
  }

  get items(): MenuItemView[] {
    return this.#items;
  }
  set items(value: MenuItemView[]) {
    this.#items = value;
    this.notify();
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  get isQuiet(): boolean {
    return this.#isQuiet;
  }
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
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
