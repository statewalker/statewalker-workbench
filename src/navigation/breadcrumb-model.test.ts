import { describe, expect, it, vi } from "vitest";
import { BreadcrumbView } from "./breadcrumb-view.js";

describe("BreadcrumbView", () => {
  it("stores items", () => {
    const bc = new BreadcrumbView({
      items: [{ label: "Home" }, { label: "Products" }],
    });
    expect(bc.items).toHaveLength(2);
    expect(bc.items[0]?.label).toBe("Home");
  });

  it("setItems replaces and notifies", () => {
    const bc = new BreadcrumbView({ items: [{ label: "Home" }] });
    const listener = vi.fn();
    bc.onUpdate(listener);

    bc.setItems([{ label: "A" }, { label: "B" }]);

    expect(bc.items).toHaveLength(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("push appends and notifies", () => {
    const bc = new BreadcrumbView({ items: [{ label: "Home" }] });
    const listener = vi.fn();
    bc.onUpdate(listener);

    bc.push({ label: "Details" });

    expect(bc.items).toHaveLength(2);
    expect(bc.items[1]?.label).toBe("Details");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("popTo truncates to index and notifies", () => {
    const bc = new BreadcrumbView({
      items: [{ label: "A" }, { label: "B" }, { label: "C" }],
    });
    const listener = vi.fn();
    bc.onUpdate(listener);

    bc.popTo(0);

    expect(bc.items).toHaveLength(1);
    expect(bc.items[0]?.label).toBe("A");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
