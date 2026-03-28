import { type ActionModel, ViewModel } from "../core/index.js";

export type ToastVariant = "positive" | "negative" | "info" | "neutral";

export class ToastModel extends ViewModel {
  #variant: ToastVariant = "neutral";
  set variant(value: ToastVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ToastVariant {
    return this.#variant;
  }

  #message: string;
  set message(value: string) {
    this.#message = value;
    this.notify();
  }
  get message(): string {
    return this.#message;
  }

  #action: ActionModel | undefined = undefined;
  set action(value: ActionModel | undefined) {
    this.#action = value;
    this.notify();
  }
  get action(): ActionModel | undefined {
    return this.#action;
  }

  #timeout: number = 5000;
  set timeout(value: number) {
    this.#timeout = value;
    this.notify();
  }
  get timeout(): number {
    return this.#timeout;
  }

  #shouldCloseOnAction: boolean = true;
  set shouldCloseOnAction(value: boolean) {
    this.#shouldCloseOnAction = value;
    this.notify();
  }
  get shouldCloseOnAction(): boolean {
    return this.#shouldCloseOnAction;
  }

  constructor(options: {
    message: string;
    variant?: ToastVariant;
    action?: ActionModel;
    timeout?: number;
    shouldCloseOnAction?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.#message = options.message;
    this.#variant = options.variant ?? "neutral";
    this.#action = options.action;
    this.#timeout = options.timeout ?? 5000;
    this.#shouldCloseOnAction = options.shouldCloseOnAction ?? true;
  }
}
