import type { ViewModel } from "../core/index.js";
import { ContainerView } from "../core/index.js";

export interface TabDescriptor {
  key: string;
  label: string;
  icon?: string;
  content: ViewModel;
  disabled?: boolean;
}

export class TabsView extends ContainerView {
  #tabs: TabDescriptor[];
  #selectedKey: string;
  #orientation: "horizontal" | "vertical";
  #density: "compact" | "regular";
  #isQuiet: boolean;
  #isEmphasized: boolean;

  constructor(options?: {
    key?: string;
    children?: ViewModel[];
    tabs?: TabDescriptor[];
    selectedKey?: string;
    orientation?: "horizontal" | "vertical";
    density?: "compact" | "regular";
    isQuiet?: boolean;
    isEmphasized?: boolean;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#tabs = options?.tabs ?? [];
    this.#selectedKey = options?.selectedKey ?? "";
    this.#orientation = options?.orientation ?? "horizontal";
    this.#density = options?.density ?? "regular";
    this.#isQuiet = options?.isQuiet ?? false;
    this.#isEmphasized = options?.isEmphasized ?? false;
  }

  get tabs(): TabDescriptor[] {
    return this.#tabs;
  }
  set tabs(value: TabDescriptor[]) {
    this.#tabs = value;
    this.notify();
  }

  get selectedKey(): string {
    return this.#selectedKey;
  }
  set selectedKey(value: string) {
    this.#selectedKey = value;
    this.notify();
  }

  get orientation(): "horizontal" | "vertical" {
    return this.#orientation;
  }
  set orientation(value: "horizontal" | "vertical") {
    this.#orientation = value;
    this.notify();
  }

  get density(): "compact" | "regular" {
    return this.#density;
  }
  set density(value: "compact" | "regular") {
    this.#density = value;
    this.notify();
  }

  get isQuiet(): boolean {
    return this.#isQuiet;
  }
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }

  get isEmphasized(): boolean {
    return this.#isEmphasized;
  }
  set isEmphasized(value: boolean) {
    this.#isEmphasized = value;
    this.notify();
  }

  setSelectedKey(key: string): void {
    const tab = this.#tabs.find((t) => t.key === key);
    if (tab && !tab.disabled) {
      this.#selectedKey = key;
      this.notify();
    }
  }

  getActiveTab(): TabDescriptor | undefined {
    return this.#tabs.find((t) => t.key === this.#selectedKey);
  }

  addTab(tab: TabDescriptor): void {
    this.#tabs = [...this.#tabs, tab];
    this.notify();
  }

  removeTab(key: string): void {
    this.#tabs = this.#tabs.filter((t) => t.key !== key);
    this.notify();
  }
}
