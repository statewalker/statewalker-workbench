import { describe, expect, it, vi } from "vitest";
import { ActionModel } from "../actions/action-model.js";
import { ViewModel } from "../core/view-model.js";
import { ContextMenuModel } from "./context-menu-model.js";

describe("ContextMenuModel", () => {
  it("stores items and target", () => {
    const target = new ViewModel({ key: "t" });
    const action = new ActionModel({ key: "copy", label: "Copy" });
    const cm = new ContextMenuModel({ items: [action], target });

    expect(cm.items).toEqual([action]);
    expect(cm.target).toBe(target);
  });

  it("setItems replaces and notifies", () => {
    const target = new ViewModel({ key: "t" });
    const cm = new ContextMenuModel({ items: [], target });
    const listener = vi.fn();
    cm.onUpdate(listener);

    const newItems = [new ActionModel({ key: "paste", label: "Paste" })];
    cm.setItems(newItems);

    expect(cm.items).toBe(newItems);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
