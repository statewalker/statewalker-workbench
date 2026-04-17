/**
 * Integration test for the publishPanel → PanelManagerView bridge
 * (app-shell-core) combined with drag-and-drop operations.
 *
 * The scenario mirrors the real chat app layout:
 *   - a "Sessions" panel published into the left area
 *   - a "Chat" panel published into the center area
 *
 * Both panels must appear in the dock tree, and a DnD of Sessions
 * into the center pane must leave both tabs in the center with
 * Sessions as the active/focused tab.
 *
 * Uses ONLY view models — no React, no DOM.
 */
import {
  type DockNode,
  type DockPanel,
  DockPanelView,
  getPanelManagerView,
  isPanel,
  publishPanel,
  ViewModel,
} from "@repo/shared-views";
import { describe, expect, it } from "vitest";
import { initShellCore } from "./init-shell-core.js";

class StubContent extends ViewModel {}

function makePanel(key: string, label: string, area: string): DockPanelView {
  return new DockPanelView({
    key,
    label,
    area,
    content: new StubContent(),
  });
}

function findPanelById(tree: DockNode, id: string): DockPanel | null {
  if (isPanel(tree)) return tree.id === id ? tree : null;
  for (const child of tree.children) {
    const found = findPanelById(child, id);
    if (found) return found;
  }
  return null;
}

function tabIds(panel: DockPanel): string[] {
  return panel.tabs.map((t) => t.id);
}

describe("chat layout — Sessions (left) + Chat (center) via publishPanel", () => {
  it("both panels appear in the layout model after publishing", () => {
    const ctx: Record<string, unknown> = {};
    const cleanupBridge = initShellCore(ctx);

    try {
      const sessions = makePanel("sessions", "Sessions", "left");
      const chat = makePanel("chat", "Chat", "center");

      publishPanel(ctx, sessions);
      publishPanel(ctx, chat);

      const pm = getPanelManagerView(ctx);

      // Both panels registered
      expect(pm.getPanel("sessions")).toBe(sessions);
      expect(pm.getPanel("chat")).toBe(chat);

      // Both area panels exist in the tree
      const tree = pm.getTree();
      const leftArea = findPanelById(tree, "area-left");
      const centerArea = findPanelById(tree, "area-center");

      expect(leftArea).not.toBeNull();
      expect(centerArea).not.toBeNull();

      // Each area contains the right tab — "Sessions" is NOT lost
      expect(tabIds(leftArea!)).toEqual(["sessions"]);
      expect(tabIds(centerArea!)).toEqual(["chat"]);
    } finally {
      cleanupBridge();
    }
  });

  it("publishing order does not matter — Sessions (left) before Chat (center)", () => {
    const ctx: Record<string, unknown> = {};
    const cleanupBridge = initShellCore(ctx);

    try {
      // Deliberately publish the non-center panel first — this is the
      // order that used to lose the Sessions tab.
      publishPanel(ctx, makePanel("sessions", "Sessions", "left"));
      publishPanel(ctx, makePanel("chat", "Chat", "center"));

      const pm = getPanelManagerView(ctx);
      const tree = pm.getTree();
      const leftArea = findPanelById(tree, "area-left");
      const centerArea = findPanelById(tree, "area-center");

      expect(leftArea).not.toBeNull();
      expect(centerArea).not.toBeNull();
      expect(tabIds(leftArea!)).toEqual(["sessions"]);
      expect(tabIds(centerArea!)).toEqual(["chat"]);
    } finally {
      cleanupBridge();
    }
  });

  it("DnD Sessions → center pane: both tabs land in center, Sessions is focused", () => {
    const ctx: Record<string, unknown> = {};
    const cleanupBridge = initShellCore(ctx);

    try {
      publishPanel(ctx, makePanel("sessions", "Sessions", "left"));
      publishPanel(ctx, makePanel("chat", "Chat", "center"));

      const pm = getPanelManagerView(ctx);

      // Simulate DnD: drag the Sessions tab out of the left pane and
      // drop it on the center pane at position "center" (merge).
      pm.moveTab("sessions", "area-left", "area-center", "center");

      const tree = pm.getTree();
      const centerArea = findPanelById(tree, "area-center");

      // Central pane contains BOTH tabs
      expect(centerArea).not.toBeNull();
      expect(tabIds(centerArea!).sort()).toEqual(["chat", "sessions"]);

      // Sessions is the active tab in the central pane
      expect(centerArea!.activeTabId).toBe("sessions");

      // Sessions is the globally focused tab
      expect(pm.focusedTabKey).toBe("sessions");

      // The left pane is gone — its only tab was moved out and the
      // empty dock was pruned from the tree.
      expect(findPanelById(tree, "area-left")).toBeNull();

      // Both panels are still registered as published panels
      expect(pm.getPanel("sessions")).toBeDefined();
      expect(pm.getPanel("chat")).toBeDefined();
    } finally {
      cleanupBridge();
    }
  });
});
