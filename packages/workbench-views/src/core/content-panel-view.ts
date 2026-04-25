import { ContainerView } from "./container-view.js";
import type { ViewModel } from "./view-model.js";

export class ContentPanelView extends ContainerView {
  #header: string | ViewModel | undefined;
  #footer: string | ViewModel | undefined;

  constructor(options?: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#header = options?.header;
    this.#footer = options?.footer;
  }

  get header(): string | ViewModel | undefined {
    return this.#header;
  }
  set header(value: string | ViewModel | undefined) {
    this.#header = value;
    this.notify();
  }

  get footer(): string | ViewModel | undefined {
    return this.#footer;
  }
  set footer(value: string | ViewModel | undefined) {
    this.#footer = value;
    this.notify();
  }
}
