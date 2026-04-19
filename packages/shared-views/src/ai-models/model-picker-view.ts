import { ActionView, ViewModel } from "../core/index.js";

export interface PickerModelItem {
  key: string;
  label: string;
  provider: string;
  isActive: boolean;
  isInteractive: boolean;
  statusReason?: string;
}

/**
 * Quantity-driven mode for the chat-header picker:
 *   "none"   — no reasoning model active; renders as a "Configure model…" button
 *   "single" — exactly one active; renders as a static label (no popover)
 *   "multi"  — ≥ 2 active; renders as a dropdown listing all active reasoning models
 */
export type ModelPickerMode = "none" | "single" | "multi";

export class ModelPickerView extends ViewModel {
  #mode: ModelPickerMode = "none";
  get mode(): ModelPickerMode {
    return this.#mode;
  }
  set mode(value: ModelPickerMode) {
    this.#mode = value;
    this.notify();
  }

  #isOpen = false;
  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  #currentLabel = "";
  get currentLabel(): string {
    return this.#currentLabel;
  }
  set currentLabel(value: string) {
    this.#currentLabel = value;
    this.notify();
  }

  #currentKey = "";
  get currentKey(): string {
    return this.#currentKey;
  }
  set currentKey(value: string) {
    this.#currentKey = value;
    this.notify();
  }

  #isActivating = false;
  get isActivating(): boolean {
    return this.#isActivating;
  }
  set isActivating(value: boolean) {
    this.#isActivating = value;
    this.notify();
  }

  #activationMessage = "";
  get activationMessage(): string {
    return this.#activationMessage;
  }
  set activationMessage(value: string) {
    this.#activationMessage = value;
    this.notify();
  }

  #items: PickerModelItem[] = [];
  get items(): PickerModelItem[] {
    return this.#items;
  }
  set items(value: PickerModelItem[]) {
    this.#items = value;
    this.notify();
  }

  readonly selectAction: ActionView<string>;
  readonly manageAction: ActionView;

  constructor(options?: { key?: string }) {
    super({ key: options?.key });
    this.selectAction = new ActionView({ key: "select" });
    this.manageAction = new ActionView({
      key: "manage",
      label: "Manage Models...",
    });
  }

  toggle(): void {
    this.#isOpen = !this.#isOpen;
    this.notify();
  }
}
