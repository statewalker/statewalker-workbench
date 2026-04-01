import { ViewModel } from "../core/index.js";

export class CheckboxView extends ViewModel {
  #label: string;
  set label(value: string) {
    this.#label = value;
    this.notify();
  }
  get label(): string {
    return this.#label;
  }

  #isSelected = false;
  set isSelected(value: boolean) {
    this.#isSelected = value;
    this.notify();
  }
  get isSelected(): boolean {
    return this.#isSelected;
  }

  #isIndeterminate = false;
  set isIndeterminate(value: boolean) {
    this.#isIndeterminate = value;
    this.notify();
  }
  get isIndeterminate(): boolean {
    return this.#isIndeterminate;
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

  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
  }

  #isEmphasized = false;
  set isEmphasized(value: boolean) {
    this.#isEmphasized = value;
    this.notify();
  }
  get isEmphasized(): boolean {
    return this.#isEmphasized;
  }

  constructor(options: {
    key?: string;
    label: string;
    isSelected?: boolean;
    isIndeterminate?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isEmphasized?: boolean;
  }) {
    super({ key: options?.key });
    this.#label = options.label;
    this.#isSelected = options.isSelected ?? false;
    this.#isIndeterminate = options.isIndeterminate ?? false;
    this.#isDisabled = options.isDisabled ?? false;
    this.#isReadOnly = options.isReadOnly ?? false;
    this.#isRequired = options.isRequired ?? false;
    this.#isEmphasized = options.isEmphasized ?? false;
  }

  toggle(): void {
    this.#isSelected = !this.#isSelected;
    this.#isIndeterminate = false;
    this.notify();
  }
}
