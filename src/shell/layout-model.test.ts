import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { LayoutModel } from "./layout-model.js";
import { LayoutPanelModel } from "./layout-panel-model.js";
import type { LayoutNode } from "./layout-types.js";

function dualPanelLayout(): LayoutNode {
  return {
    type: "split",
    direction: "horizontal",
    sizes: [50, 50],
    children: [
      { type: "panel", name: "left" },
      { type: "panel", name: "right" },
    ],
  };
}

function makeContent(key: string, label = key) {
  return { key, label, model: new ViewModel({ key }), closable: true };
}

describe("LayoutPanelModel", () => {
  it("starts empty", () => {
    const panel = new LayoutPanelModel("test");
    expect(panel.name).toBe("test");
    expect(panel.contents).toHaveLength(0);
    expect(panel.activeKey).toBeNull();
    expect(panel.isEmpty).toBe(true);
    expect(panel.focused).toBe(false);
  });

  it("publish adds content and sets it active", () => {
    const panel = new LayoutPanelModel("test");
    const listener = vi.fn();
    panel.onUpdate(listener);

    panel.publish(makeContent("a", "Tab A"));

    expect(panel.contents).toHaveLength(1);
    expect(panel.activeKey).toBe("a");
    expect(panel.isEmpty).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("publish returns unpublish function", () => {
    const panel = new LayoutPanelModel("test");
    const unpublish = panel.publish(makeContent("a"));
    expect(panel.contents).toHaveLength(1);

    unpublish();
    expect(panel.contents).toHaveLength(0);
    expect(panel.activeKey).toBeNull();
  });

  it("unpublish activates next tab", () => {
    const panel = new LayoutPanelModel("test");
    panel.publish(makeContent("a"));
    panel.publish(makeContent("b"));
    expect(panel.activeKey).toBe("b");

    panel.unpublish("b");
    expect(panel.activeKey).toBe("a");
  });

  it("activateTab changes active key", () => {
    const panel = new LayoutPanelModel("test");
    panel.publish(makeContent("a"));
    panel.publish(makeContent("b"));

    panel.activateTab("a");
    expect(panel.activeKey).toBe("a");
  });

  it("activateTab does not notify if already active", () => {
    const panel = new LayoutPanelModel("test");
    panel.publish(makeContent("a"));

    const listener = vi.fn();
    panel.onUpdate(listener);
    panel.activateTab("a");
    expect(listener).not.toHaveBeenCalled();
  });

  it("setFocused toggles focus and notifies", () => {
    const panel = new LayoutPanelModel("test");
    const listener = vi.fn();
    panel.onUpdate(listener);

    panel.setFocused(true);
    expect(panel.focused).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    panel.setFocused(true); // same value
    expect(listener).toHaveBeenCalledTimes(1); // no extra notification

    panel.setFocused(false);
    expect(panel.focused).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("getActiveContent returns first if activeKey is null", () => {
    const panel = new LayoutPanelModel("test");
    panel.publish(makeContent("a"));
    panel.publish(makeContent("b"));

    // Force activeKey to something invalid
    panel.activateTab("nonexistent");
    const active = panel.getActiveContent();
    expect(active?.key).toBe("a"); // falls back to first
  });

  it("findContent returns matching content or undefined", () => {
    const panel = new LayoutPanelModel("test");
    panel.publish(makeContent("a"));
    expect(panel.findContent("a")?.key).toBe("a");
    expect(panel.findContent("z")).toBeUndefined();
  });
});

describe("LayoutModel", () => {
  it("creates LayoutPanelModels for each panel in the tree", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    expect(layout.getPanelNames()).toEqual(["left", "right"]);
    expect(layout.getPanel("left")).toBeInstanceOf(LayoutPanelModel);
    expect(layout.getPanel("right")).toBeInstanceOf(LayoutPanelModel);
    expect(layout.getPanel("nonexistent")).toBeUndefined();
  });

  it("sets initial active panel and focus", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    expect(layout.activePanel).toBe("left");
    expect(layout.getPanel("left")?.focused).toBe(true);
    expect(layout.getPanel("right")?.focused).toBe(false);
  });

  it("publish delegates to LayoutPanelModel", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    layout.publish("left", makeContent("files"));
    expect(layout.getPanel("left")?.contents).toHaveLength(1);
    expect(layout.getPanel("right")?.contents).toHaveLength(0);
  });

  it("publish throws for unknown panel", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    expect(() => layout.publish("nonexistent", makeContent("x"))).toThrow(
      'Panel "nonexistent" not found',
    );
  });

  it("publishOrActivate activates existing content", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    layout.publish("left", makeContent("a"));
    layout.publish("left", makeContent("b"));

    // Should activate existing, not add duplicate
    layout.publishOrActivate("left", makeContent("a"));
    expect(layout.getPanel("left")?.contents).toHaveLength(2);
    expect(layout.getPanel("left")?.activeKey).toBe("a");
  });

  it("publishOrActivate finds content across panels", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    layout.publish("right", makeContent("shared"));

    // Try to publish to left, but it's already in right → activates in right
    layout.publishOrActivate("left", makeContent("shared"));
    expect(layout.getPanel("right")?.activeKey).toBe("shared");
    expect(layout.activePanel).toBe("right"); // focus moved
    expect(layout.getPanel("left")?.contents).toHaveLength(0);
  });

  it("setActivePanel toggles focus between panels", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const layoutListener = vi.fn();
    layout.onUpdate(layoutListener);

    const leftListener = vi.fn();
    const rightListener = vi.fn();
    layout.getPanel("left")?.onUpdate(leftListener);
    layout.getPanel("right")?.onUpdate(rightListener);

    layout.setActivePanel("right");

    expect(layout.activePanel).toBe("right");
    expect(layout.getPanel("left")?.focused).toBe(false);
    expect(layout.getPanel("right")?.focused).toBe(true);
    expect(layoutListener).toHaveBeenCalledTimes(1);
    expect(leftListener).toHaveBeenCalledTimes(1); // unfocused
    expect(rightListener).toHaveBeenCalledTimes(1); // focused
  });

  it("setActivePanel is a no-op for same panel", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const listener = vi.fn();
    layout.onUpdate(listener);

    layout.setActivePanel("left");
    expect(listener).not.toHaveBeenCalled();
  });

  it("focusNextPanel cycles through panels", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    layout.focusNextPanel();
    expect(layout.activePanel).toBe("right");

    layout.focusNextPanel();
    expect(layout.activePanel).toBe("left");
  });

  it("setSizes updates split proportions without notifying", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const listener = vi.fn();
    layout.onUpdate(listener);

    layout.setSizes([], [30, 70]); // root split
    expect(listener).not.toHaveBeenCalled();

    // Verify sizes updated
    const root = layout.root;
    expect(root.type).toBe("split");
    if (root.type === "split") {
      expect(root.sizes).toEqual([30, 70]);
    }
  });

  it("resizeSplit updates sizes AND notifies", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const listener = vi.fn();
    layout.onUpdate(listener);

    layout.resizeSplit([], [20, 80]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("splitPanel creates a new panel", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const newPanel = layout.splitPanel("left", "vertical", "preview");

    expect(newPanel).toBeInstanceOf(LayoutPanelModel);
    expect(newPanel.name).toBe("preview");
    expect(layout.getPanel("preview")).toBe(newPanel);
    expect(layout.getPanelNames()).toContain("preview");
  });

  it("removePanel removes panel and collapses tree", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    layout.removePanel("right");

    expect(layout.getPanelNames()).toEqual(["left"]);
    expect(layout.getPanel("right")).toBeUndefined();
    // Root should have collapsed to just the left panel
    expect(layout.root.type).toBe("panel");
  });

  it("removePanel moves focus if active panel is removed", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "right",
    });

    layout.removePanel("right");
    expect(layout.activePanel).toBe("left");
  });

  it("notification boundaries: panel changes don't notify layout", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const layoutListener = vi.fn();
    layout.onUpdate(layoutListener);

    // Publishing to a panel should NOT trigger layout notification
    layout.getPanel("left")?.publish(makeContent("a"));
    expect(layoutListener).not.toHaveBeenCalled();

    // Tab activation should NOT trigger layout notification
    layout.getPanel("left")?.publish(makeContent("b"));
    layout.getPanel("left")?.activateTab("a");
    expect(layoutListener).not.toHaveBeenCalled();
  });

  it("toJSON serializes root and activePanel", () => {
    const layout = new LayoutModel({
      root: dualPanelLayout(),
      activePanel: "left",
    });

    const json = layout.toJSON();
    expect(json.root).toEqual(dualPanelLayout());
    expect(json.activePanel).toBe("left");
  });

  it("single panel layout works", () => {
    const layout = new LayoutModel({
      root: { type: "panel", name: "main" },
      activePanel: "main",
    });

    expect(layout.getPanelNames()).toEqual(["main"]);
    layout.publish("main", makeContent("a"));
    expect(layout.getPanel("main")?.contents).toHaveLength(1);
  });
});
