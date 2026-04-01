import { ViewModel } from "../core/index.js";

export type PopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top start"
  | "top end"
  | "bottom start"
  | "bottom end";

export class PopoverModel extends ViewModel {
  #content: ViewModel;
  set content(value: ViewModel) {
    this.#content = value;
    this.notify();
  }
  get content(): ViewModel {
    return this.#content;
  }

  #placement: PopoverPlacement;
  set placement(value: PopoverPlacement) {
    this.#placement = value;
    this.notify();
  }
  get placement(): PopoverPlacement {
    return this.#placement;
  }

  #isOpen: boolean;
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }
  get isOpen(): boolean {
    return this.#isOpen;
  }

  #offset: number;
  set offset(value: number) {
    this.#offset = value;
    this.notify();
  }
  get offset(): number {
    return this.#offset;
  }

  #crossOffset: number;
  set crossOffset(value: number) {
    this.#crossOffset = value;
    this.notify();
  }
  get crossOffset(): number {
    return this.#crossOffset;
  }

  #isNonModal: boolean;
  set isNonModal(value: boolean) {
    this.#isNonModal = value;
    this.notify();
  }
  get isNonModal(): boolean {
    return this.#isNonModal;
  }

  constructor(options: {
    key?: string;
    content: ViewModel;
    placement?: PopoverPlacement;
    isOpen?: boolean;
    offset?: number;
    crossOffset?: number;
    isNonModal?: boolean;
  }) {
    super({ key: options.key });
    this.#content = options.content;
    this.#placement = options.placement ?? "bottom";
    this.#isOpen = options.isOpen ?? false;
    this.#offset = options.offset ?? 0;
    this.#crossOffset = options.crossOffset ?? 0;
    this.#isNonModal = options.isNonModal ?? false;
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
