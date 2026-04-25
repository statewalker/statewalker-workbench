import { ContentPanelView } from "../core/content-panel-view.js";
import type { ViewModel } from "../core/index.js";

/** Predefined dialog sizes or an arbitrary CSS value (e.g. "55rem", "80%"). */
export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | (string & {});

export interface DialogButton {
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  /** Called when clicked. Return `false` to prevent auto-close. */
  onClick?: () => boolean | undefined;
}

export class DialogView extends ContentPanelView {
  #isDismissable: boolean;
  #isOpen: boolean;
  #size: DialogSize;
  #fullScreen: boolean;
  #centered: boolean;
  #closeOnEscape: boolean;
  #closeOnClickOutside: boolean;
  #buttons: DialogButton[];

  /** Resolved by the first button's onClick (or dismiss). */
  #resolve?: (label: string | undefined) => void;

  constructor(options: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    isDismissable?: boolean;
    isOpen?: boolean;
    size?: DialogSize;
    fullScreen?: boolean;
    centered?: boolean;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    buttons?: DialogButton[];
  }) {
    super(options);
    this.#isDismissable = options.isDismissable ?? true;
    this.#isOpen = options.isOpen ?? false;
    this.#size = options.size ?? "md";
    this.#fullScreen = options.fullScreen ?? false;
    this.#centered = options.centered ?? true;
    this.#closeOnEscape = options.closeOnEscape ?? true;
    this.#closeOnClickOutside = options.closeOnClickOutside ?? true;
    this.#buttons = options.buttons ?? [];
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

  get fullScreen(): boolean {
    return this.#fullScreen;
  }
  set fullScreen(value: boolean) {
    this.#fullScreen = value;
    this.notify();
  }

  get centered(): boolean {
    return this.#centered;
  }
  set centered(value: boolean) {
    this.#centered = value;
    this.notify();
  }

  get closeOnEscape(): boolean {
    return this.#closeOnEscape;
  }
  set closeOnEscape(value: boolean) {
    this.#closeOnEscape = value;
    this.notify();
  }

  get closeOnClickOutside(): boolean {
    return this.#closeOnClickOutside;
  }
  set closeOnClickOutside(value: boolean) {
    this.#closeOnClickOutside = value;
    this.notify();
  }

  get buttons(): DialogButton[] {
    return this.#buttons;
  }
  set buttons(value: DialogButton[]) {
    this.#buttons = value;
    this.notify();
  }

  /** Returns a promise that resolves with the clicked button label, or undefined on dismiss. */
  waitForClose(): Promise<string | undefined> {
    return new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  /** Called by the renderer when a button is clicked or the dialog is dismissed. */
  close(buttonLabel?: string): void {
    this.#resolve?.(buttonLabel);
    this.#resolve = undefined;
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
