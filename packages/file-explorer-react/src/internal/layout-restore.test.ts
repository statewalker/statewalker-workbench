import { fileExplorerSpecId } from "@statewalker/file-explorer";
import { SpecStore } from "@statewalker/json-render";
import { describe, expect, it } from "vitest";
import {
  extractFileExplorerPanelIds,
  restoreFileExplorerSpecsFromLayout,
} from "./layout-restore.js";

describe("extractFileExplorerPanelIds", () => {
  it("returns the panel-id suffixes from a layout JSON", () => {
    expect(
      extractFileExplorerPanelIds({
        panels: {
          "file-explorer:left": {},
          "file-explorer:right": {},
          "chat:abc": {},
          "markdown-viewer:/x.md": {},
        },
      }),
    ).toEqual(["left", "right"]);
  });

  it("returns [] for missing/empty/unparseable input", () => {
    expect(extractFileExplorerPanelIds(null)).toEqual([]);
    expect(extractFileExplorerPanelIds({})).toEqual([]);
    expect(extractFileExplorerPanelIds({ panels: null })).toEqual([]);
    expect(extractFileExplorerPanelIds({ panels: {} })).toEqual([]);
  });

  it("ignores entries without a suffix after the prefix", () => {
    expect(
      extractFileExplorerPanelIds({
        panels: { "file-explorer:": {}, "file-explorer:ok": {} },
      }),
    ).toEqual(["ok"]);
  });
});

describe("restoreFileExplorerSpecsFromLayout", () => {
  function makeStorage(layout: unknown): Storage {
    const map = new Map<string, string>();
    if (layout !== undefined) map.set("layout", JSON.stringify(layout));
    return {
      get length() {
        return map.size;
      },
      clear: () => map.clear(),
      key: () => null,
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
      removeItem: (k) => {
        map.delete(k);
      },
    };
  }

  it("creates one spec per file-explorer panel in the persisted layout", () => {
    const store = new SpecStore();
    const storage = makeStorage({
      panels: { "file-explorer:left": {}, "file-explorer:right": {} },
    });
    restoreFileExplorerSpecsFromLayout(store, storage, "layout");
    expect(store.get(fileExplorerSpecId("left"))).not.toBeNull();
    expect(store.get(fileExplorerSpecId("right"))).not.toBeNull();
  });

  it("is idempotent — does not throw on a second pass", () => {
    const store = new SpecStore();
    const storage = makeStorage({ panels: { "file-explorer:left": {} } });
    restoreFileExplorerSpecsFromLayout(store, storage, "layout");
    expect(() => restoreFileExplorerSpecsFromLayout(store, storage, "layout")).not.toThrow();
  });

  it("no-ops when storage is undefined or the key is empty", () => {
    const store = new SpecStore();
    expect(() => restoreFileExplorerSpecsFromLayout(store, undefined, "layout")).not.toThrow();
    const empty = makeStorage(undefined);
    restoreFileExplorerSpecsFromLayout(store, empty, "layout");
    expect(store.get(fileExplorerSpecId("anything"))).toBeNull();
  });

  it("survives a non-JSON layout payload", () => {
    const store = new SpecStore();
    const storage = makeStorage(undefined);
    storage.setItem("layout", "not json{{{");
    expect(() => restoreFileExplorerSpecsFromLayout(store, storage, "layout")).not.toThrow();
  });
});
