import { ViewModel } from "../core/view-model.js";

export interface TabDescriptor {
  key: string;
  label: string;
  icon?: string;
  content: ViewModel;
  disabled?: boolean;
}

export class TabsView extends ViewModel {
  tabs: TabDescriptor[];
  activeKey: string;

  constructor(options: {
    tabs: TabDescriptor[];
    activeKey?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.tabs = options.tabs;
    this.activeKey = options.activeKey ?? options.tabs[0]?.key ?? "";
  }

  setActiveKey(key: string) {
    const tab = this.tabs.find((t) => t.key === key);
    if (tab && !tab.disabled) {
      this.activeKey = key;
      this.notify();
    }
  }

  getActiveTab(): TabDescriptor | undefined {
    return this.tabs.find((t) => t.key === this.activeKey);
  }

  addTab(tab: TabDescriptor) {
    this.tabs = [...this.tabs, tab];
    this.notify();
  }

  removeTab(key: string) {
    this.tabs = this.tabs.filter((t) => t.key !== key);
    if (this.activeKey === key) {
      this.activeKey = this.tabs[0]?.key ?? "";
    }
    this.notify();
  }
}
