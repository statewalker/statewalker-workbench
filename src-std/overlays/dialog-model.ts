import type { ViewModel } from "../core/index.js";
import { ContentPanelModel } from "../layout/content-panel-model.js";

export type DialogType =
  | "modal"
  | "popover"
  | "tray"
  | "fullscreen"
  | "fullscreenTakeover";

export type DialogSize = "S" | "M" | "L";

export class DialogModel extends ContentPanelModel {
  #type: DialogType;
  #isDismissable: boolean;
  #isOpen: boolean;
  #size: DialogSize;

  constructor(options: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    type?: DialogType;
    isDismissable?: boolean;
    isOpen?: boolean;
    size?: DialogSize;
  }) {
    super(options);
    this.#type = options.type ?? "modal";
    this.#isDismissable = options.isDismissable ?? true;
    this.#isOpen = options.isOpen ?? false;
    this.#size = options.size ?? "M";
  }

  get type(): DialogType {
    return this.#type;
  }
  set type(value: DialogType) {
    this.#type = value;
    this.notify();
  }

  get isDismissable(): boolean {
    return this.#isDismissable;
  }
  set isDismissable(value: boolean) {
    this.#isDismissable = value;
    this.notify();
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  get size(): DialogSize {
    return this.#size;
  }
  set size(value: DialogSize) {
    this.#size = value;
    this.notify();
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
