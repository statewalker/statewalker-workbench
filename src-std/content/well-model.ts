import type { ViewModel } from "../core/index.js";
import { ContainerModel } from "../core/index.js";

export class WellModel extends ContainerModel<ViewModel> {
  #role: string | undefined;
  set role(value: string | undefined) {
    this.#role = value;
    this.notify();
  }
  get role(): string | undefined {
    return this.#role;
  }

  constructor(options?: {
    role?: string;
    children?: ViewModel[];
    key?: string;
  }) {
    super({ children: options?.children, key: options?.key });
    this.#role = options?.role;
  }
}
