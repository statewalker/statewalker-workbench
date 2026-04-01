import { ContainerView, type ViewModel } from "../core/index.js";

export type MessageSeverity = "error" | "warning" | "info";

export interface FieldMessage {
  text: string;
  severity: MessageSeverity;
}

/** Interface for child field views that participate in form value collection. */
interface FieldLike {
  key: string;
  value?: unknown;
  errorMessage?: string;
}

function _isFieldLike(child: ViewModel): child is ViewModel & FieldLike {
  return "value" in child;
}

export class FormView extends ContainerView {
  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  #isReadOnly = false;
  set isReadOnly(value: boolean) {
    this.#isReadOnly = value;
    this.notify();
  }
  get isReadOnly(): boolean {
    return this.#isReadOnly;
  }

  #validationBehavior: "native" | "aria" = "native";
  set validationBehavior(value: "native" | "aria") {
    this.#validationBehavior = value;
    this.notify();
  }
  get validationBehavior(): "native" | "aria" {
    return this.#validationBehavior;
  }

  #labelPosition: "top" | "side" = "top";
  set labelPosition(value: "top" | "side") {
    this.#labelPosition = value;
    this.notify();
  }
  get labelPosition(): "top" | "side" {
    return this.#labelPosition;
  }

  #labelAlign: "start" | "end" = "start";
  set labelAlign(value: "start" | "end") {
    this.#labelAlign = value;
    this.notify();
  }
  get labelAlign(): "start" | "end" {
    return this.#labelAlign;
  }

  #necessityIndicator: "icon" | "label" = "icon";
  set necessityIndicator(value: "icon" | "label") {
    this.#necessityIndicator = value;
    this.notify();
  }
  get necessityIndicator(): "icon" | "label" {
    return this.#necessityIndicator;
  }

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    validationBehavior?: "native" | "aria";
    labelPosition?: "top" | "side";
    labelAlign?: "start" | "end";
    necessityIndicator?: "icon" | "label";
  }) {
    super({ key: options?.key, children: options?.children });
    this.#isRequired = options?.isRequired ?? false;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#validationBehavior = options?.validationBehavior ?? "native";
    this.#labelPosition = options?.labelPosition ?? "top";
    this.#labelAlign = options?.labelAlign ?? "start";
    this.#necessityIndicator = options?.necessityIndicator ?? "icon";
  }
}
