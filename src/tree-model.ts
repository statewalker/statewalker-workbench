import { ViewModel } from "./view-model.js";

export interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

export class TreeModel extends ViewModel {
  roots: TreeNode[];
  selectedKey: string | undefined;
  expandedKeys: Set<string>;

  constructor(options: { roots: TreeNode[]; key?: string }) {
    super({ key: options.key });
    this.roots = options.roots;
    this.selectedKey = undefined;
    this.expandedKeys = new Set<string>();
  }

  select(key: string) {
    this.selectedKey = key;
    this.notify();
  }

  toggleExpand(key: string) {
    if (this.expandedKeys.has(key)) {
      this.expandedKeys.delete(key);
    } else {
      this.expandedKeys.add(key);
    }
    this.notify();
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys.has(key);
  }
}
