import { type ActionView, ContainerView } from "../core/index.js";

export class ActionBarView extends ContainerView<ActionView> {
  #isEmphasized: boolean;
  #selectedItemCount: number;

  constructor(options?: {
    key?: string;
    children?: ActionView[];
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
