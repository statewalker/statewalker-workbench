import { type ActionView, ContainerView, ViewModel } from "../core/index.js";

export class MenuItemView extends ViewModel {
  action: ActionView;
  #shortcut: string | undefined;
  #subItems: MenuItemView[];
  #isSeparator: boolean;

  constructor(options: {
    key?: string;
    action: ActionView;
    shortcut?: string;
    subItems?: MenuItemView[];
    isSeparator?: boolean;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#shortcut = options.shortcut;
    this.#subItems = options.subItems ?? [];
    this.#isSeparator = options.isSeparator ?? false;
  }

  get shortcut(): string | undefined {
    return this.#shortcut;
  }
  set shortcut(value: string | undefined) {
    this.#shortcut = value;
    this.notify();
  }

  get subItems(): MenuItemView[] {
    return this.#subItems;
  }
  set subItems(value: MenuItemView[]) {
    this.#subItems = value;
    this.notify();
  }

  get isSeparator(): boolean {
    return this.#isSeparator;
  }
  set isSeparator(value: boolean) {
    this.#isSeparator = value;
    this.notify();
  }
}

export class MenuView extends ContainerView<MenuItemView> {
  #selectionMode: "none" | "single" | "multiple";
  #selectedKeys: Set<string>;
  #disabledKeys: Set<string>;

  constructor(options?: {
    key?: string;
    children?: MenuItemView[];
    selectionMode?: "none" | "single" | "multiple";
    selectedKeys?: Set<string>;
    disabledKeys?: Set<string>;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#selectionMode = options?.selectionMode ?? "none";
    this.#selectedKeys = options?.selectedKeys ?? new Set();
    this.#disabledKeys = options?.disabledKeys ?? new Set();
  }

  get selectionMode(): "none" | "single" | "multiple" {
    return this.#selectionMode;
  }
  set selectionMode(value: "none" | "single" | "multiple") {
    this.#selectionMode = value;
    this.notify();
  }

  get selectedKeys(): Set<string> {
    return this.#selectedKeys;
  }
  set selectedKeys(value: Set<string>) {
    this.#selectedKeys = value;
    this.notify();
  }

  get disabledKeys(): Set<string> {
    return this.#disabledKeys;
  }
  set disabledKeys(value: Set<string>) {
    this.#disabledKeys = value;
    this.notify();
  }
}
