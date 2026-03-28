import type { ActionModel, ViewModel } from "../core/index.js";
import { ContentPanelModel } from "../layout/content-panel-model.js";

export type AlertDialogVariant =
  | "confirmation"
  | "information"
  | "destructive"
  | "error"
  | "warning";

export class AlertDialogModel extends ContentPanelModel {
  #variant: AlertDialogVariant;
  #primaryAction: ActionModel;
  #secondaryAction: ActionModel | undefined;
  #cancelAction: ActionModel | undefined;
  #isOpen: boolean;

  constructor(options: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    variant?: AlertDialogVariant;
    primaryAction: ActionModel;
    secondaryAction?: ActionModel;
    cancelAction?: ActionModel;
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

  get primaryAction(): ActionModel {
    return this.#primaryAction;
  }
  set primaryAction(value: ActionModel) {
    this.#primaryAction = value;
    this.notify();
  }

  get secondaryAction(): ActionModel | undefined {
    return this.#secondaryAction;
  }
  set secondaryAction(value: ActionModel | undefined) {
    this.#secondaryAction = value;
    this.notify();
  }

  get cancelAction(): ActionModel | undefined {
    return this.#cancelAction;
  }
  set cancelAction(value: ActionModel | undefined) {
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
