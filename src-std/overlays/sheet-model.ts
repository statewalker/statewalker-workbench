import { ViewModel } from "../core/index.js";

export type SheetSide = "left" | "right" | "top" | "bottom";

export class SheetModel extends ViewModel {
  #content: ViewModel | undefined;
  set content(value: ViewModel | undefined) {
    this.#content = value;
    this.notify();
  }
  get content(): ViewModel | undefined {
    return this.#content;
  }

  #side: SheetSide;
  set side(value: SheetSide) {
    this.#side = value;
    this.notify();
  }
  get side(): SheetSide {
    return this.#side;
  }

  #isOpen: boolean;
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }
  get isOpen(): boolean {
    return this.#isOpen;
  }

  #isDismissable: boolean;
  set isDismissable(value: boolean) {
    this.#isDismissable = value;
    this.notify();
  }
  get isDismissable(): boolean {
    return this.#isDismissable;
  }

  constructor(options?: {
    key?: string;
    content?: ViewModel;
    side?: SheetSide;
    isOpen?: boolean;
    isDismissable?: boolean;
  }) {
    super({ key: options?.key });
    this.#content = options?.content;
    this.#side = options?.side ?? "right";
    this.#isOpen = options?.isOpen ?? false;
    this.#isDismissable = options?.isDismissable ?? true;
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  setContent(content: ViewModel | undefined): void {
    this.content = content;
  }
}
