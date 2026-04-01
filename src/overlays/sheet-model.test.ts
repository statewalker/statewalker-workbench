import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { SheetView } from "./sheet-view.js";

describe("SheetView", () => {
  it("has sensible defaults", () => {
    const s = new SheetView({});
    expect(s.side).toBe("right");
    expect(s.open).toBe(false);
    expect(s.header).toBeUndefined();
    expect(s.content).toBeUndefined();
    expect(s.actions).toEqual([]);
  });

  it("accepts all options", () => {
    const content = new ViewModel({ key: "c" });
    const s = new SheetView({
      header: "Details",
      icon: "info",
      content,
      side: "left",
      open: true,
      key: "s1",
    });
    expect(s.key).toBe("s1");
    expect(s.header).toBe("Details");
    expect(s.side).toBe("left");
    expect(s.open).toBe(true);
    expect(s.content).toBe(content);
  });

  it("setOpen notifies", () => {
    const s = new SheetView({});
    const listener = vi.fn();
    s.onUpdate(listener);

    s.setOpen(true);
    expect(s.open).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("toggle flips open state", () => {
    const s = new SheetView({});
    s.toggle();
    expect(s.open).toBe(true);
    s.toggle();
    expect(s.open).toBe(false);
  });

  it("setContent notifies", () => {
    const s = new SheetView({});
    const listener = vi.fn();
    s.onUpdate(listener);

    const content = new ViewModel({ key: "new" });
    s.setContent(content);

    expect(s.content).toBe(content);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
