import { ContentPanelView } from "../core/content-panel-view.js";
import type { ActionView, ViewModel } from "../core/index.js";

export type AlertDialogVariant =
  | "confirmation"
  | "information"
  | "destructive"
  | "error"
  | "warning";

export class AlertDialogView extends ContentPanelView {
  #variant: AlertDialogVariant;
  #primaryAction: ActionView;
  #secondaryAction: ActionView | undefined;
  #cancelAction: ActionView | undefined;
  #isOpen: boolean;

  constructor(options: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    variant?: AlertDialogVariant;
    primaryAction: ActionView;
    secondaryAction?: ActionView;
    cancelAction?: ActionView;
    isOpen?: boolean;
  }) {
    super(options);
    this.#variant = options.variant ?? "confirmation";
    this.#primaryAction = options.primaryAction;
    this.#secondaryAction = options.secondaryAction;
    this.#cancelAction = options.cancelAction;
    this.#isOpen = options.isOpen ?? false;
  }

  get variant(): AlertDialogVariant {
    return this.#variant;
  }
  set variant(value: AlertDialogVariant) {
    this.#variant = value;
    this.notify();
  }

  get primaryAction(): ActionView {
    return this.#primaryAction;
  }
  set primaryAction(value: ActionView) {
    this.#primaryAction = value;
    this.notify();
  }

  get secondaryAction(): ActionView | undefined {
    return this.#secondaryAction;
  }
  set secondaryAction(value: ActionView | undefined) {
    this.#secondaryAction = value;
    this.notify();
  }

  get cancelAction(): ActionView | undefined {
    return this.#cancelAction;
  }
  set cancelAction(value: ActionView | undefined) {
    this.#cancelAction = value;
    this.notify();
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  setOpen(open: boolean): void {
    this.isOpen = open;
  }
}
