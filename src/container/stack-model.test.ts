import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../view-model.js";
import { StackModel } from "./stack-model.js";

describe("StackModel", () => {
  it("has sensible defaults", () => {
    const stack = new StackModel({});
    expect(stack.direction).toBe("vertical");
    expect(stack.gap).toBe("1rem");
    expect(stack.padding).toBe("0");
    expect(stack.align).toBe("stretch");
    expect(stack.justify).toBe("start");
    expect(stack.items).toEqual([]);
    expect(stack.wrap).toBe(false);
  });

  it("accepts all options", () => {
    const child = new ViewModel({ key: "child-1" });
    const stack = new StackModel({
      direction: "horizontal",
      gap: "2rem",
      padding: "1rem",
      align: "center",
      justify: "between",
      items: [child],
      wrap: true,
      key: "my-stack",
    });
    expect(stack.key).toBe("my-stack");
    expect(stack.direction).toBe("horizontal");
    expect(stack.gap).toBe("2rem");
    expect(stack.padding).toBe("1rem");
    expect(stack.align).toBe("center");
    expect(stack.justify).toBe("between");
    expect(stack.items).toEqual([child]);
    expect(stack.wrap).toBe(true);
  });

  it("addItem appends and notifies", () => {
    const stack = new StackModel({});
    const listener = vi.fn();
    stack.onUpdate(listener);

    const item = new ViewModel({ key: "a" });
    stack.addItem(item);

    expect(stack.items).toHaveLength(1);
    expect(stack.items[0]).toBe(item);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("removeItem removes by key and notifies", () => {
    const a = new ViewModel({ key: "a" });
    const b = new ViewModel({ key: "b" });
    const stack = new StackModel({ items: [a, b] });
    const listener = vi.fn();
    stack.onUpdate(listener);

    stack.removeItem("a");

    expect(stack.items).toHaveLength(1);
    expect(stack.items[0]).toBe(b);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setItems replaces all items and notifies", () => {
    const stack = new StackModel({ items: [new ViewModel({ key: "old" })] });
    const listener = vi.fn();
    stack.onUpdate(listener);

    const newItems = [new ViewModel({ key: "x" }), new ViewModel({ key: "y" })];
    stack.setItems(newItems);

    expect(stack.items).toBe(newItems);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
