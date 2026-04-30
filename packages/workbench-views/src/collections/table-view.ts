import { onChangeNotifier } from "@statewalker/shared-baseclass";
import { ContainerView } from "../core/index.js";

export interface ColumnDescriptor<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  /**
   * Row property whose value the renderer should display as a leading
   * icon for this cell. The value is an icon name resolved by the
   * UI layer's IconRegistry. Data-only — views never reference the
   * Icon component.
   */
  iconKey?: keyof T & string;
  /**
   * Row property whose value the renderer should apply as a CSS
   * class on the leading icon (e.g. tailwind text-color utilities).
   * Ignored when `iconKey` is unset.
   */
  iconColorKey?: keyof T & string;
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

  /**
   * Key of the most recently activated row (clicked / Enter pressed).
   * Set by `activateRow(key)`. The `onRowActivate` notifier fires
   * whenever this value changes.
   */
  #activeRowKey: string | undefined = undefined;
  get activeRowKey(): string | undefined {
    return this.#activeRowKey;
  }

  /** Convenience: the row matching `activeRowKey`, if any. */
  get activeRow(): T | undefined {
    if (this.#activeRowKey === undefined) return undefined;
    return this.#rows.find((r) => this.rowKey(r) === this.#activeRowKey);
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

  /**
   * Subscribe to row activations. Fires when `activeRowKey` changes
   * (re-clicking the same row is a no-op — by design).
   */
  onRowActivate = onChangeNotifier(this.onUpdate, () => this.#activeRowKey);

  /**
   * Subscribe to sort requests. Fires when the sort descriptor (column
   * or direction) changes.
   */
  onSort = onChangeNotifier(
    this.onUpdate,
    () => `${this.#sortDescriptor?.column ?? ""}:${this.#sortDescriptor?.direction ?? ""}`,
  );

  /**
   * Mark a row as activated. Updates `activeRowKey` and notifies; the
   * `onRowActivate` notifier fires when the value changes.
   */
  activateRow(key: string): void {
    if (this.#activeRowKey === key) return;
    this.#activeRowKey = key;
    this.notify();
  }

  /**
   * Replace the table data. Optionally also updates the selection and
   * the sort descriptor in a single notify().
   */
  setRows(rows: T[], params?: { selected?: Set<string>; sortDescriptor?: SortDescriptor }): void {
    this.#rows = rows;
    this.#selectedKeys = params?.selected ?? new Set();
    if (params?.sortDescriptor !== undefined) {
      this.#sortDescriptor = params.sortDescriptor;
    }
    // TODO: check if parameters are changed before calling notify().
    this.notify();
  }

  sort(columnKey: string): void {
    if (this.#sortDescriptor && this.#sortDescriptor.column === columnKey) {
      this.#sortDescriptor = {
        column: columnKey,
        direction: this.#sortDescriptor.direction === "ascending" ? "descending" : "ascending",
      };
    } else {
      this.#sortDescriptor = { column: columnKey, direction: "ascending" };
    }
    this.notify();
  }

  protected sortRows(rows: T[], column: string, direction: "ascending" | "descending"): T[] {
    return rows.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[column];
      const bVal = (b as Record<string, unknown>)[column];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === "ascending" ? cmp : -cmp;
    });
  }

  get sortedRows(): T[] {
    if (!this.#sortDescriptor) return this.#rows;
    const { column, direction } = this.#sortDescriptor;
    const rows = [...this.#rows];
    return this.sortRows(rows, column, direction);
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
