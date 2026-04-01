import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { AccordionView } from "./accordion-view.js";

function item(key: string, disabled = false) {
  return {
    key,
    title: key,
    content: new ViewModel({ key: `c-${key}` }),
    disabled,
  };
}

describe("AccordionView", () => {
  it("has sensible defaults", () => {
    const acc = new AccordionView({ items: [item("a")] });
    expect(acc.expandedKeys.size).toBe(0);
    expect(acc.multiple).toBe(false);
  });

  it("accepts initial expandedKeys", () => {
    const acc = new AccordionView({
      items: [item("a"), item("b")],
      expandedKeys: ["a"],
    });
    expect(acc.isExpanded("a")).toBe(true);
    expect(acc.isExpanded("b")).toBe(false);
  });

  it("toggle expands and collapses", () => {
    const acc = new AccordionView({ items: [item("a"), item("b")] });
    const listener = vi.fn();
    acc.onUpdate(listener);

    acc.toggle("a");
    expect(acc.isExpanded("a")).toBe(true);

    acc.toggle("a");
    expect(acc.isExpanded("a")).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("single mode collapses others when expanding", () => {
    const acc = new AccordionView({
      items: [item("a"), item("b")],
      expandedKeys: ["a"],
    });

    acc.toggle("b");

    expect(acc.isExpanded("a")).toBe(false);
    expect(acc.isExpanded("b")).toBe(true);
  });

  it("multiple mode keeps others expanded", () => {
    const acc = new AccordionView({
      items: [item("a"), item("b")],
      expandedKeys: ["a"],
      multiple: true,
    });

    acc.toggle("b");

    expect(acc.isExpanded("a")).toBe(true);
    expect(acc.isExpanded("b")).toBe(true);
  });

  it("toggle ignores disabled items", () => {
    const acc = new AccordionView({ items: [item("a", true)] });
    const listener = vi.fn();
    acc.onUpdate(listener);

    acc.toggle("a");

    expect(acc.isExpanded("a")).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it("expandAll expands all non-disabled items", () => {
    const acc = new AccordionView({
      items: [item("a"), item("b", true), item("c")],
    });

    acc.expandAll();

    expect(acc.isExpanded("a")).toBe(true);
    expect(acc.isExpanded("b")).toBe(false);
    expect(acc.isExpanded("c")).toBe(true);
  });

  it("collapseAll clears all", () => {
    const acc = new AccordionView({
      items: [item("a"), item("b")],
      expandedKeys: ["a", "b"],
    });

    acc.collapseAll();

    expect(acc.expandedKeys.size).toBe(0);
  });
});
