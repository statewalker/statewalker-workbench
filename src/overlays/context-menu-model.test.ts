import { describe, expect, it, vi } from "vitest";
import { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";
import { ContextMenuView } from "./context-menu-view.js";

describe("ContextMenuView", () => {
  it("stores items and target", () => {
    const target = new ViewModel({ key: "t" });
    const action = new ActionView({ key: "copy", label: "Copy" });
    const cm = new ContextMenuView({ items: [action], target });

    expect(cm.items).toEqual([action]);
    expect(cm.target).toBe(target);
  });

  it("setItems replaces and notifies", () => {
    const target = new ViewModel({ key: "t" });
    const cm = new ContextMenuView({ items: [], target });
    const listener = vi.fn();
    cm.onUpdate(listener);

    const newItems = [new ActionView({ key: "paste", label: "Paste" })];
    cm.setItems(newItems);

    expect(cm.items).toBe(newItems);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
