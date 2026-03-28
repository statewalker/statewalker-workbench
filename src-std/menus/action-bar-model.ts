import { type ActionModel, ContainerModel } from "../core/index.js";

export class ActionBarModel extends ContainerModel<ActionModel> {
  #isEmphasized: boolean;
  #selectedItemCount: number;

  constructor(options?: {
    key?: string;
    children?: ActionModel[];
    isEmphasized?: boolean;
    selectedItemCount?: number;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#isEmphasized = options?.isEmphasized ?? false;
    this.#selectedItemCount = options?.selectedItemCount ?? 0;
  }

  get isEmphasized(): boolean {
    return this.#isEmphasized;
  }
  set isEmphasized(value: boolean) {
    this.#isEmphasized = value;
    this.notify();
  }

  get selectedItemCount(): number {
    return this.#selectedItemCount;
  }
  set selectedItemCount(value: number) {
    this.#selectedItemCount = value;
    this.notify();
  }

  setSelectedItemCount(count: number): void {
    this.#selectedItemCount = count;
    this.notify();
  }
}
