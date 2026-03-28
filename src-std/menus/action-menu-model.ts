import { type ActionModel, ViewModel } from "../core/index.js";
import type { MenuItemModel } from "./menu-model.js";

export class ActionMenuModel extends ViewModel {
  action: ActionModel;
  #items: MenuItemModel[];
  #isOpen: boolean;
  #isQuiet: boolean;

  constructor(options: {
    key?: string;
    action: ActionModel;
    items?: MenuItemModel[];
    isOpen?: boolean;
    isQuiet?: boolean;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#items = options.items ?? [];
    this.#isOpen = options.isOpen ?? false;
    this.#isQuiet = options.isQuiet ?? false;
  }

  get items(): MenuItemModel[] {
    return this.#items;
  }
  set items(value: MenuItemModel[]) {
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
