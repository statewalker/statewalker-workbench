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

function isFieldLike(child: ViewModel): child is ViewModel & FieldLike {
  return "value" in child;
}

function isContainerLike(child: ViewModel): child is ViewModel & { children: ViewModel[] } {
  if (typeof child !== "object" || !child) return false;
  if (!("children" in child)) return false;
  return Array.isArray((child as unknown as { children: ViewModel[] }).children);
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

  /** Find a child field by its key. */
  findField(fieldKey: string): (ViewModel & FieldLike) | undefined {
    const fields = this.getFields();
    return fields[fieldKey];
  }

  /** Get the value of a single child field. */
  getValue(fieldKey: string): unknown {
    return this.findField(fieldKey)?.value;
  }

  /** Get all child field values as a record keyed by field key. */
  getValues(): Record<string, unknown> {
    const fields = this.getFields();
    return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
  }

  /** Set an error message on a child field. */
  setMessage(fieldKey: string, message: FieldMessage | undefined): void {
    const field = this.findField(fieldKey);
    if (field && "errorMessage" in field) {
      (field as ViewModel & { errorMessage: string | undefined }).errorMessage = message?.text;
    }
  }

  private getFields(): Record<string, ViewModel & FieldLike> {
    return visit(this);

    function visit(
      parent: { children: ViewModel[] },
      result: Record<string, ViewModel & FieldLike> = {},
    ): Record<string, ViewModel & FieldLike> {
      for (const child of parent.children) {
        if (isFieldLike(child)) {
          result[child.key] = child;
        } else if (isContainerLike(child)) {
          visit(child, result);
        }
      }
      return result;
    }
  }

  /** Check if any child field has an error message. */
  hasErrors(): boolean {
    const fields = this.getFields();
    return Object.values(fields).some(
      (field) => field.errorMessage != null && field.errorMessage !== "",
    );
  }

  /** Clear all child field error messages. */
  reset(): void {
    const fields = this.getFields();
    for (const field of Object.values(fields)) {
      if ("errorMessage" in field) {
        (field as ViewModel & { errorMessage: string | undefined }).errorMessage = undefined;
      }
    }
    this.notify();
  }
}
