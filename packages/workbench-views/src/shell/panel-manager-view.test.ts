import { describe, expect, it } from "vitest";
import { ViewModel } from "../core/view-model.js";
import type { DockNode, DockPanel, DockSplit } from "../dock/index.js";
import { isPanel, isSplit } from "../dock/index.js";
import { PanelManagerView } from "./panel-manager-view.js";
import { DockPanelView } from "./panel-view.js";

// Minimal ViewModel content stub (DockPanelView requires a ViewModel)
class StubContent extends ViewModel {}

function makePanel(key: string, area = "center"): DockPanelView {
  return new DockPanelView({
    key,
    label: key,
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

function collectAllPanels(tree: DockNode): DockPanel[] {
  if (isPanel(tree)) return [tree];
  return tree.children.flatMap(collectAllPanels);
}

function tabIds(panel: DockPanel): string[] {
  return panel.tabs.map((t) => t.id);
}

describe("PanelManagerView", () => {
  describe("addPanel", () => {
    it("places the first center panel as the tree root", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));

      const tree = pm.getTree();
      expect(isPanel(tree)).toBe(true);
      const panel = tree as DockPanel;
      expect(panel.id).toBe("area-center");
      expect(tabIds(panel)).toEqual(["a"]);
      expect(panel.activeTabId).toBe("a");
    });

    it("groups multiple center panels into the same dock", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));

      const center = findPanelById(pm.getTree(), "area-center");
      expect(center).not.toBeNull();
      expect(tabIds(center!)).toEqual(["a", "b"]);
    });

    it("places left/right/bottom areas as splits around center", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c", "center"));
      pm.addPanel(makePanel("l", "left"));
      pm.addPanel(makePanel("r", "right"));
      pm.addPanel(makePanel("b", "bottom"));

      const tree = pm.getTree();
      expect(findPanelById(tree, "area-center")).not.toBeNull();
      expect(findPanelById(tree, "area-left")).not.toBeNull();
      expect(findPanelById(tree, "area-right")).not.toBeNull();
      expect(findPanelById(tree, "area-bottom")).not.toBeNull();

      const all = collectAllPanels(tree);
      expect(all).toHaveLength(4);
    });

    it("registers the panel in the panels map", () => {
      const pm = new PanelManagerView();
      const panel = makePanel("a", "center");
      pm.addPanel(panel);

      expect(pm.getPanel("a")).toBe(panel);
      expect(pm.getAllPanels()).toEqual([panel]);
    });

    it("returns a disposer that removes the panel", () => {
      const pm = new PanelManagerView();
      const dispose = pm.addPanel(makePanel("a", "center"));

      dispose();
      expect(pm.getPanel("a")).toBeUndefined();
      const center = findPanelById(pm.getTree(), "area-center");
      expect(center?.tabs ?? []).toEqual([]);
    });
  });

  describe("removePanel", () => {
    it("removes the tab and prunes the empty panel from the tree", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c", "center"));
      pm.addPanel(makePanel("l", "left"));

      pm.removePanel("l");

      expect(findPanelById(pm.getTree(), "area-left")).toBeNull();
      // Tree collapses back to just the center panel
      const tree = pm.getTree();
      expect(isPanel(tree)).toBe(true);
      expect((tree as DockPanel).id).toBe("area-center");
    });

    it("clears focus if the focused tab is removed", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.focus("a");
      expect(pm.focusedTabKey).toBe("a");

      pm.removePanel("a");
      expect(pm.focusedTabKey).toBeNull();
    });
  });

  describe("moveTab — center merge", () => {
    it("moves a tab into another panel (cross-panel center drop)", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c1", "center"));
      pm.addPanel(makePanel("r1", "right"));

      pm.moveTab("c1", "area-center", "area-right", "center");

      const right = findPanelById(pm.getTree(), "area-right");
      expect(right).not.toBeNull();
      expect(tabIds(right!)).toEqual(["r1", "c1"]);

      // Center panel collapsed because its last tab moved out
      expect(findPanelById(pm.getTree(), "area-center")).toBeNull();
    });

    it("keeps both tabs visible after a center merge", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c1", "center"));
      pm.addPanel(makePanel("c2", "center"));
      pm.addPanel(makePanel("r1", "right"));

      pm.moveTab("c1", "area-center", "area-right", "center");

      const center = findPanelById(pm.getTree(), "area-center");
      const right = findPanelById(pm.getTree(), "area-right");
      expect(tabIds(center!)).toEqual(["c2"]);
      expect(tabIds(right!)).toEqual(["r1", "c1"]);

      // Panel registry still has all three panels
      expect(
        pm
          .getAllPanels()
          .map((p) => p.key)
          .sort(),
      ).toEqual(["c1", "c2", "r1"]);
    });

    it("makes the moved tab active in the target panel", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c1", "center"));
      pm.addPanel(makePanel("r1", "right"));

      pm.moveTab("c1", "area-center", "area-right", "center");

      const right = findPanelById(pm.getTree(), "area-right");
      expect(right?.activeTabId).toBe("c1");
    });

    it("is a no-op when dropping onto the same panel at center", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));

      const treeBefore = pm.getTree();
      pm.moveTab("a", "area-center", "area-center", "center");
      expect(pm.getTree()).toBe(treeBefore);
    });
  });

  describe("moveTab — split drops", () => {
    it("splits the same panel horizontally (same-panel left drop)", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));

      pm.moveTab("a", "area-center", "area-center", "left");

      const tree = pm.getTree();
      expect(isSplit(tree)).toBe(true);
      const split = tree as DockSplit;
      expect(split.direction).toBe("horizontal");
      expect(split.children).toHaveLength(2);

      // Both original tabs survive, in different panels now
      const panels = collectAllPanels(tree);
      expect(panels).toHaveLength(2);
      const allTabs = panels.flatMap(tabIds).sort();
      expect(allTabs).toEqual(["a", "b"]);
    });

    it("does nothing when splitting a panel with only one tab", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("only", "center"));

      const treeBefore = pm.getTree();
      pm.moveTab("only", "area-center", "area-center", "left");
      expect(pm.getTree()).toBe(treeBefore);
    });

    it("split drop from one panel to another creates a nested split", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("c1", "center"));
      pm.addPanel(makePanel("r1", "right"));
      pm.addPanel(makePanel("r2", "right"));

      pm.moveTab("r1", "area-right", "area-center", "bottom");

      // All three panels still have their tabs somewhere in the tree
      const allTabs = collectAllPanels(pm.getTree()).flatMap(tabIds).sort();
      expect(allTabs).toEqual(["c1", "r1", "r2"]);
    });
  });

  describe("canMoveTab", () => {
    it("rejects same-panel center drop", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      expect(pm.canMoveTab("area-center", "area-center", "center")).toBe(false);
    });

    it("rejects same-panel split when panel has only one tab", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      expect(pm.canMoveTab("area-center", "area-center", "left")).toBe(false);
    });

    it("allows same-panel split when panel has multiple tabs", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));
      expect(pm.canMoveTab("area-center", "area-center", "left")).toBe(true);
    });

    it("allows cross-panel center merge", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "right"));
      expect(pm.canMoveTab("area-center", "area-right", "center")).toBe(true);
    });
  });

  describe("setActiveTab", () => {
    it("changes the active tab of a panel", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));

      pm.setActiveTab("area-center", "b");

      const center = findPanelById(pm.getTree(), "area-center");
      expect(center?.activeTabId).toBe("b");
    });

    it("ignores unknown panels or tabs", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      const before = pm.getTree();

      pm.setActiveTab("area-center", "nonexistent");
      expect(pm.getTree()).toBe(before);

      pm.setActiveTab("area-nope", "a");
      expect(pm.getTree()).toBe(before);
    });
  });

  describe("focus", () => {
    it("sets focus and makes the tab active in its panel", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));
      pm.setActiveTab("area-center", "a");

      pm.focus("b");

      expect(pm.focusedTabKey).toBe("b");
      const center = findPanelById(pm.getTree(), "area-center");
      expect(center?.activeTabId).toBe("b");
    });
  });

  describe("notify / onUpdate integration", () => {
    it("fires onUpdate exactly once per mutation", () => {
      const pm = new PanelManagerView();
      let count = 0;
      pm.onUpdate(() => {
        count++;
      });

      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "right"));
      pm.moveTab("a", "area-center", "area-right", "center");
      pm.removePanel("a");

      expect(count).toBe(4);
    });
  });

  describe("full DnD scenario — the regression use case", () => {
    it("dragged tab does not disappear after cross-dock drop", () => {
      // Simulate the exact user scenario:
      // two explorer Files panels (one in center, one in right) and
      // the user drags the center one into the right panel.
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("left:files", "center"));
      pm.addPanel(makePanel("right:files", "right"));

      pm.moveTab("left:files", "area-center", "area-right", "center");

      // The dragged tab MUST still exist in the panel map and the tree
      expect(pm.getPanel("left:files")).toBeDefined();
      expect(pm.getPanelIdForTab("left:files")).toBe("area-right");

      const right = findPanelById(pm.getTree(), "area-right");
      expect(right).not.toBeNull();
      // Both tabs are in the right panel
      expect(tabIds(right!)).toEqual(["right:files", "left:files"]);

      // Center panel is gone (became empty and was pruned)
      expect(findPanelById(pm.getTree(), "area-center")).toBeNull();

      // The original right tab did not disappear
      expect(pm.getPanel("right:files")).toBeDefined();
      expect(pm.getPanelIdForTab("right:files")).toBe("area-right");
    });

    it("supports same-dock rearrangement via split", () => {
      const pm = new PanelManagerView();
      pm.addPanel(makePanel("a", "center"));
      pm.addPanel(makePanel("b", "center"));
      pm.addPanel(makePanel("c", "center"));

      // Drag 'a' to split center on the right
      pm.moveTab("a", "area-center", "area-center", "right");

      // All three tabs survive
      const allTabs = collectAllPanels(pm.getTree()).flatMap(tabIds).sort();
      expect(allTabs).toEqual(["a", "b", "c"]);

      // Tree became a split
      expect(isSplit(pm.getTree())).toBe(true);

      // All three panels still exist in the registry
      expect(
        pm
          .getAllPanels()
          .map((p) => p.key)
          .sort(),
      ).toEqual(["a", "b", "c"]);
    });
  });
});
