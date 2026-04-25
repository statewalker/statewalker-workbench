import { ViewModel } from "./view-model.js";

export class ContainerView<T = ViewModel> extends ViewModel {
  children: T[];

  constructor(options?: { children?: T[]; key?: string }) {
    super({ key: options?.key });
    this.children = options?.children ?? [];
  }

  addChild(child: T) {
    this.children = [...this.children, child];
    this.notify();
  }

  removeChild(index: number) {
    this.children = this.children.filter((_, i) => i !== index);
    this.notify();
  }

  setChildren(children: T[]) {
    this.children = children;
    this.notify();
  }

  get count(): number {
    return this.children.length;
  }
}
