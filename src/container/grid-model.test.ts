import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../view-model.js";
import { GridModel } from "./grid-model.js";

describe("GridModel", () => {
  it("has sensible defaults", () => {
    const grid = new GridModel({});
    expect(grid.columns).toBe("repeat(auto-fit, minmax(200px, 1fr))");
    expect(grid.gap).toBe("1rem");
    expect(grid.padding).toBe("0");
    expect(grid.items).toEqual([]);
  });

  it("accepts all options", () => {
    const child = new ViewModel({ key: "c1" });
    const grid = new GridModel({
      columns: "1fr 2fr",
      gap: "8px",
      padding: "16px",
      items: [child],
      key: "g1",
    });
    expect(grid.key).toBe("g1");
    expect(grid.columns).toBe("1fr 2fr");
    expect(grid.gap).toBe("8px");
    expect(grid.padding).toBe("16px");
    expect(grid.items).toEqual([child]);
  });

  it("addItem appends and notifies", () => {
    const grid = new GridModel({});
    const listener = vi.fn();
    grid.onUpdate(listener);

    const item = new ViewModel({ key: "a" });
    grid.addItem(item);

    expect(grid.items).toHaveLength(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("removeItem removes by key and notifies", () => {
    const a = new ViewModel({ key: "a" });
    const b = new ViewModel({ key: "b" });
    const grid = new GridModel({ items: [a, b] });
    const listener = vi.fn();
    grid.onUpdate(listener);

    grid.removeItem("a");

    expect(grid.items).toHaveLength(1);
    expect(grid.items[0]).toBe(b);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setItems replaces all items and notifies", () => {
    const grid = new GridModel({ items: [new ViewModel({ key: "old" })] });
    const listener = vi.fn();
    grid.onUpdate(listener);

    const newItems = [new ViewModel({ key: "x" })];
    grid.setItems(newItems);

    expect(grid.items).toBe(newItems);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
