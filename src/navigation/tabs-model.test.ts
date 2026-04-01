import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { TabsView } from "./tabs-view.js";

function tab(key: string, disabled = false) {
  return {
    key,
    label: key,
    content: new ViewModel({ key: `c-${key}` }),
    disabled,
  };
}

describe("TabsView", () => {
  it("defaults activeKey to first tab", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b")] });
    expect(tabs.activeKey).toBe("a");
  });

  it("accepts explicit activeKey", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b")], activeKey: "b" });
    expect(tabs.activeKey).toBe("b");
  });

  it("handles empty tabs", () => {
    const tabs = new TabsView({ tabs: [] });
    expect(tabs.activeKey).toBe("");
  });

  it("setActiveKey switches tab and notifies", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b")] });
    const listener = vi.fn();
    tabs.onUpdate(listener);

    tabs.setActiveKey("b");

    expect(tabs.activeKey).toBe("b");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setActiveKey ignores disabled tabs", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b", true)] });
    const listener = vi.fn();
    tabs.onUpdate(listener);

    tabs.setActiveKey("b");

    expect(tabs.activeKey).toBe("a");
    expect(listener).not.toHaveBeenCalled();
  });

  it("setActiveKey ignores unknown keys", () => {
    const tabs = new TabsView({ tabs: [tab("a")] });
    const listener = vi.fn();
    tabs.onUpdate(listener);

    tabs.setActiveKey("unknown");

    expect(tabs.activeKey).toBe("a");
    expect(listener).not.toHaveBeenCalled();
  });

  it("getActiveTab returns the current tab descriptor", () => {
    const t = tab("x");
    const tabs = new TabsView({ tabs: [t] });
    expect(tabs.getActiveTab()).toBe(t);
  });

  it("addTab appends and notifies", () => {
    const tabs = new TabsView({ tabs: [tab("a")] });
    const listener = vi.fn();
    tabs.onUpdate(listener);

    tabs.addTab(tab("b"));

    expect(tabs.tabs).toHaveLength(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("removeTab removes and resets activeKey when needed", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b")] });
    tabs.setActiveKey("a");

    tabs.removeTab("a");

    expect(tabs.tabs).toHaveLength(1);
    expect(tabs.activeKey).toBe("b");
  });

  it("removeTab keeps activeKey when removing non-active tab", () => {
    const tabs = new TabsView({ tabs: [tab("a"), tab("b")], activeKey: "a" });

    tabs.removeTab("b");

    expect(tabs.activeKey).toBe("a");
  });
});
