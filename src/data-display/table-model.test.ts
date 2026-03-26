import { describe, expect, it, vi } from "vitest";
import { TableModel } from "./table-model.js";

interface Row {
  id: string;
  name: string;
  age: number;
}

function makeTable(rows: Row[] = []) {
  return new TableModel<Row>({
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "age", label: "Age", sortable: true },
    ],
    rows,
    rowKey: (r) => r.id,
  });
}

describe("TableModel", () => {
  it("has sensible defaults", () => {
    const t = makeTable();
    expect(t.rows).toEqual([]);
    expect(t.sortKey).toBeUndefined();
    expect(t.sortDirection).toBe("asc");
    expect(t.selectedKeys.size).toBe(0);
    expect(t.selectable).toBe(false);
  });

  it("setRows replaces and clears selection", () => {
    const t = makeTable([{ id: "1", name: "A", age: 30 }]);
    t.selectedKeys.add("1");
    const listener = vi.fn();
    t.onUpdate(listener);

    t.setRows([{ id: "2", name: "B", age: 25 }]);

    expect(t.rows).toHaveLength(1);
    expect(t.rows[0]?.name).toBe("B");
    expect(t.selectedKeys.size).toBe(0);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("sort sets sortKey and direction", () => {
    const t = makeTable();
    const listener = vi.fn();
    t.onUpdate(listener);

    t.sort("name");
    expect(t.sortKey).toBe("name");
    expect(t.sortDirection).toBe("asc");

    t.sort("name");
    expect(t.sortDirection).toBe("desc");

    t.sort("age");
    expect(t.sortKey).toBe("age");
    expect(t.sortDirection).toBe("asc");

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("sort ignores non-sortable columns", () => {
    const t = new TableModel<Row>({
      columns: [{ key: "name", label: "Name", sortable: false }],
      rowKey: (r) => r.id,
    });
    const listener = vi.fn();
    t.onUpdate(listener);

    t.sort("name");

    expect(t.sortKey).toBeUndefined();
    expect(listener).not.toHaveBeenCalled();
  });

  it("sortedRows returns sorted copy", () => {
    const rows: Row[] = [
      { id: "1", name: "Charlie", age: 30 },
      { id: "2", name: "Alice", age: 25 },
      { id: "3", name: "Bob", age: 35 },
    ];
    const t = makeTable(rows);

    t.sort("name");
    const asc = t.sortedRows;
    expect(asc.map((r) => r.name)).toEqual(["Alice", "Bob", "Charlie"]);

    t.sort("name");
    const desc = t.sortedRows;
    expect(desc.map((r) => r.name)).toEqual(["Charlie", "Bob", "Alice"]);
  });

  it("sortedRows returns original when no sort", () => {
    const rows: Row[] = [{ id: "1", name: "A", age: 1 }];
    const t = makeTable(rows);
    expect(t.sortedRows).toBe(rows);
  });

  it("selection operations work when selectable", () => {
    const rows: Row[] = [
      { id: "1", name: "A", age: 1 },
      { id: "2", name: "B", age: 2 },
    ];
    const t = new TableModel<Row>({
      columns: [{ key: "name", label: "Name" }],
      rows,
      rowKey: (r) => r.id,
      selectable: true,
    });
    const listener = vi.fn();
    t.onUpdate(listener);

    t.toggleSelection("1");
    expect(t.isSelected("1")).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    t.toggleSelection("1");
    expect(t.isSelected("1")).toBe(false);

    t.selectAll();
    expect(t.selectedKeys.size).toBe(2);

    t.clearSelection();
    expect(t.selectedKeys.size).toBe(0);
  });

  it("selection is no-op when not selectable", () => {
    const t = makeTable([{ id: "1", name: "A", age: 1 }]);
    const listener = vi.fn();
    t.onUpdate(listener);

    t.toggleSelection("1");
    t.selectAll();

    expect(t.selectedKeys.size).toBe(0);
    expect(listener).not.toHaveBeenCalled();
  });
});
