import { ContainerView } from "../core/index.js";

export interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

export type TreeViewSelectionMode = "none" | "single" | "multiple";

export class TreeView extends ContainerView<TreeNode> {
  #roots: TreeNode[] = [];
  set roots(value: TreeNode[]) {
    this.#roots = value;
    this.notify();
  }
  get roots(): TreeNode[] {
    return this.#roots;
  }

  #selectionMode: TreeViewSelectionMode = "none";
  set selectionMode(value: TreeViewSelectionMode) {
    this.#selectionMode = value;
    this.notify();
  }
  get selectionMode(): TreeViewSelectionMode {
    return this.#selectionMode;
  }

  #selectedKeys: Set<string> = new Set();
  set selectedKeys(value: Set<string>) {
    this.#selectedKeys = value;
    this.notify();
  }
  get selectedKeys(): Set<string> {
    return this.#selectedKeys;
  }

  #expandedKeys: Set<string> = new Set();
  set expandedKeys(value: Set<string>) {
    this.#expandedKeys = value;
    this.notify();
  }
  get expandedKeys(): Set<string> {
    return this.#expandedKeys;
  }

  #disabledKeys: Set<string> = new Set();
  set disabledKeys(value: Set<string>) {
    this.#disabledKeys = value;
    this.notify();
  }
  get disabledKeys(): Set<string> {
    return this.#disabledKeys;
  }

  constructor(options?: {
    roots?: TreeNode[];
    selectionMode?: TreeViewSelectionMode;
    selectedKeys?: Set<string>;
    expandedKeys?: Set<string>;
    disabledKeys?: Set<string>;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#roots = options?.roots ?? [];
    this.#selectionMode = options?.selectionMode ?? "none";
    this.#selectedKeys = options?.selectedKeys ?? new Set();
    this.#expandedKeys = options?.expandedKeys ?? new Set();
    this.#disabledKeys = options?.disabledKeys ?? new Set();
  }

  setRoots(roots: TreeNode[]): void {
    this.#roots = roots;
    this.notify();
  }

  select(key: string): void {
    if (this.#disabledKeys.has(key)) return;
    const next = new Set(this.#selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (this.#selectionMode === "single") {
        next.clear();
      }
      next.add(key);
    }
    this.#selectedKeys = next;
    this.notify();
  }

  toggleExpand(key: string): void {
    const next = new Set(this.#expandedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.#expandedKeys = next;
    this.notify();
  }

  isExpanded(key: string): boolean {
    return this.#expandedKeys.has(key);
  }

  isSelected(key: string): boolean {
    return this.#selectedKeys.has(key);
  }
}
