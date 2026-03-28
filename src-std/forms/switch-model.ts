import { ViewModel } from "../core/index.js";

export class SwitchModel extends ViewModel {
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
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isEmphasized?: boolean;
  }) {
    super({ key: options?.key });
    this.#label = options.label;
    this.#isSelected = options.isSelected ?? false;
    this.#isDisabled = options.isDisabled ?? false;
    this.#isReadOnly = options.isReadOnly ?? false;
    this.#isEmphasized = options.isEmphasized ?? false;
  }

  toggle(): void {
    this.#isSelected = !this.#isSelected;
    this.notify();
  }
}
