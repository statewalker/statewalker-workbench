import { type ActionModel, ViewModel } from "../core/index.js";

export type ToggleButtonSize = "XS" | "S" | "M" | "L" | "XL";

export class ToggleButtonModel extends ViewModel {
  readonly action: ActionModel;

  #isSelected = false;
  set isSelected(value: boolean) {
    this.#isSelected = value;
    this.notify();
  }
  get isSelected(): boolean {
    return this.#isSelected;
  }

  #isEmphasized = false;
  set isEmphasized(value: boolean) {
    this.#isEmphasized = value;
    this.notify();
  }
  get isEmphasized(): boolean {
    return this.#isEmphasized;
  }

  #size: ToggleButtonSize = "M";
  set size(value: ToggleButtonSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ToggleButtonSize {
    return this.#size;
  }

  constructor(options: {
    action: ActionModel;
    isSelected?: boolean;
    isEmphasized?: boolean;
    size?: ToggleButtonSize;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#isSelected = options.isSelected ?? false;
    this.#isEmphasized = options.isEmphasized ?? false;
    this.#size = options.size ?? "M";
  }

  toggle(): void {
    this.#isSelected = !this.#isSelected;
    this.notify();
  }
}
