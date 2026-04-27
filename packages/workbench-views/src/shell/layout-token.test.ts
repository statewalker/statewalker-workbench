/**
 * Verify the `Layout` token's surface (publishPanel, focus, getActivePanel)
 * works through `workspace.requireAdapter(Layout)`.
 */
import { Workspace } from "@statewalker/workspace-api";
import { describe, expect, it } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { Layout } from "./panel-manager-view.js";
import { DockPanelView } from "./panel-view.js";

class StubContent extends ViewModel {}

function makePanel(key: string, area = "center"): DockPanelView {
  return new DockPanelView({ key, label: key, area, content: new StubContent() });
}

describe("Layout token", () => {
  it("publishPanel registers a panel and returns a disposer", () => {
    const ws = new Workspace();
    const layout = ws.requireAdapter(Layout);
    const panel = makePanel("explorer", "left");

    const dispose = layout.publishPanel(panel);
    expect(typeof dispose).toBe("function");
    expect(layout.getPanel("explorer")).toBe(panel);

    dispose();
    expect(layout.getPanel("explorer")).toBeUndefined();
  });

  it("focus selects the active panel; getActivePanel returns it", () => {
    const ws = new Workspace();
    const layout = ws.requireAdapter(Layout);

    const a = makePanel("a", "left");
    const b = makePanel("b", "center");
    layout.publishPanel(a);
    layout.publishPanel(b);

    layout.focus("a");
    expect(layout.getActivePanel()).toBe(a);

    layout.focus("b");
    expect(layout.getActivePanel()).toBe(b);

    layout.focus(null);
    expect(layout.getActivePanel()).toBeNull();
  });

  it("re-publishing a panel with the same key is idempotent", () => {
    const ws = new Workspace();
    const layout = ws.requireAdapter(Layout);
    const a = makePanel("a", "center");

    layout.publishPanel(a);
    layout.publishPanel(a);
    expect(layout.getAllPanels()).toEqual([a]);
  });
});
