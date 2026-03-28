import { ViewModel } from "../core/view-model.js";

export type SortDirection = "asc" | "desc";

export interface ColumnDescriptor<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => string;
}

export class TableModel<T = Record<string, unknown>> extends ViewModel {
  columns: ColumnDescriptor<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectedKeys: Set<string>;
  sortKey: string | undefined;
  sortDirection: SortDirection;
  selectable: boolean;

  constructor(options: {
    columns: ColumnDescriptor<T>[];
    rows?: T[];
    rowKey: (row: T) => string;
    selectable?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.columns = options.columns;
    this.rows = options.rows ?? [];
    this.rowKey = options.rowKey;
    this.selectedKeys = new Set();
    this.sortKey = undefined;
    this.sortDirection = "asc";
    this.selectable = options.selectable ?? false;
  }

  setRows(rows: T[]) {
    this.rows = rows;
    this.selectedKeys.clear();
    this.notify();
  }

  sort(columnKey: string) {
    const col = this.columns.find((c) => c.key === columnKey);
    if (!col?.sortable) return;

    if (this.sortKey === columnKey) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = columnKey;
      this.sortDirection = "asc";
    }
    this.notify();
  }

  get sortedRows(): T[] {
    if (!this.sortKey) return this.rows;
    const key = this.sortKey;
    const dir = this.sortDirection === "asc" ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[key];
      const bVal = (b as Record<string, unknown>)[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (aVal < bVal) return -dir;
      if (aVal > bVal) return dir;
      return 0;
    });
  }

  toggleSelection(key: string) {
    if (!this.selectable) return;
    if (this.selectedKeys.has(key)) {
      this.selectedKeys.delete(key);
    } else {
      this.selectedKeys.add(key);
    }
    this.notify();
  }

  selectAll() {
    if (!this.selectable) return;
    for (const row of this.rows) {
      this.selectedKeys.add(this.rowKey(row));
    }
    this.notify();
  }

  clearSelection() {
    this.selectedKeys.clear();
    this.notify();
  }

  isSelected(key: string): boolean {
    return this.selectedKeys.has(key);
  }
}
