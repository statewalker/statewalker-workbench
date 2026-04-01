import { ContainerView } from "../core/index.js";

export interface ColumnDescriptor<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => unknown;
}

export interface SortDescriptor {
  column: string;
  direction: "ascending" | "descending";
}

export type TableSelectionMode = "none" | "single" | "multiple";
export type TableDensity = "compact" | "regular" | "spacious";
export type TableOverflowMode = "wrap" | "truncate";

export class TableView<T = Record<string, unknown>> extends ContainerView<T> {
  #columns: ColumnDescriptor<T>[] = [];
  set columns(value: ColumnDescriptor<T>[]) {
    this.#columns = value;
    this.notify();
  }
  get columns(): ColumnDescriptor<T>[] {
    return this.#columns;
  }

  #rows: T[] = [];
  set rows(value: T[]) {
    this.#rows = value;
    this.notify();
  }
  get rows(): T[] {
    return this.#rows;
  }

  readonly rowKey: (row: T) => string;

  #sortDescriptor: SortDescriptor | undefined = undefined;
  set sortDescriptor(value: SortDescriptor | undefined) {
    this.#sortDescriptor = value;
    this.notify();
  }
  get sortDescriptor(): SortDescriptor | undefined {
    return this.#sortDescriptor;
  }

  #selectionMode: TableSelectionMode = "none";
  set selectionMode(value: TableSelectionMode) {
    this.#selectionMode = value;
    this.notify();
  }
  get selectionMode(): TableSelectionMode {
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

  #density: TableDensity = "regular";
  set density(value: TableDensity) {
    this.#density = value;
    this.notify();
  }
  get density(): TableDensity {
    return this.#density;
  }

  #overflowMode: TableOverflowMode = "truncate";
  set overflowMode(value: TableOverflowMode) {
    this.#overflowMode = value;
    this.notify();
  }
  get overflowMode(): TableOverflowMode {
    return this.#overflowMode;
  }

  constructor(options: {
    columns?: ColumnDescriptor<T>[];
    rows?: T[];
    rowKey: (row: T) => string;
    sortDescriptor?: SortDescriptor;
    selectionMode?: TableSelectionMode;
    selectedKeys?: Set<string>;
    density?: TableDensity;
    overflowMode?: TableOverflowMode;
    key?: string;
  }) {
    super({ key: options.key });
    this.#columns = options.columns ?? [];
    this.#rows = options.rows ?? [];
    this.rowKey = options.rowKey;
    this.#sortDescriptor = options.sortDescriptor;
    this.#selectionMode = options.selectionMode ?? "none";
    this.#selectedKeys = options.selectedKeys ?? new Set();
    this.#density = options.density ?? "regular";
    this.#overflowMode = options.overflowMode ?? "truncate";
  }

  setRows(rows: T[]): void {
    this.#rows = rows;
    this.#selectedKeys = new Set();
    this.notify();
  }

  sort(columnKey: string): void {
    if (this.#sortDescriptor && this.#sortDescriptor.column === columnKey) {
      this.#sortDescriptor = {
        column: columnKey,
        direction:
          this.#sortDescriptor.direction === "ascending"
            ? "descending"
            : "ascending",
      };
    } else {
      this.#sortDescriptor = { column: columnKey, direction: "ascending" };
    }
    this.notify();
  }

  get sortedRows(): T[] {
    if (!this.#sortDescriptor) return this.#rows;
    const { column, direction } = this.#sortDescriptor;
    return [...this.#rows].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[column];
      const bVal = (b as Record<string, unknown>)[column];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === "ascending" ? cmp : -cmp;
    });
  }

  toggleSelection(key: string): void {
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

  selectAll(): void {
    this.#selectedKeys = new Set(this.#rows.map(this.rowKey));
    this.notify();
  }

  clearSelection(): void {
    this.#selectedKeys = new Set();
    this.notify();
  }

  isSelected(key: string): boolean {
    return this.#selectedKeys.has(key);
  }
}
