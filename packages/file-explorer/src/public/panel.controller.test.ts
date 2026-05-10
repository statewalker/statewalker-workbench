import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { describe, expect, it, vi } from "vitest";
import { createPanelController, parentPath } from "./panel.controller.js";

async function flush(): Promise<void> {
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
}

describe("parentPath", () => {
  it("collapses to root from a one-deep path", () => {
    expect(parentPath("/foo")).toBe("/");
  });
  it("strips a trailing slash before walking up", () => {
    expect(parentPath("/foo/bar/")).toBe("/foo");
  });
  it("returns root for root", () => {
    expect(parentPath("/")).toBe("/");
  });
});

describe("createPanelController", () => {
  it("loads root entries on construction and inserts a synthetic .. when navigating into a child", async () => {
    const files = new MemFilesApi();
    await files.write("/a.txt", ["hi"]);
    await files.mkdir("/dir");
    await files.write("/dir/inner.txt", ["x"]);

    const panel = createPanelController({ files, title: "Files" });
    await flush();

    const rootNames = panel.model.getVisibleEntries().map((e) => e.name);
    expect(rootNames).toContain("a.txt");
    expect(rootNames).toContain("dir");
    expect(rootNames).not.toContain("..");

    panel.navigate("/dir");
    await flush();

    const childNames = panel.model.getVisibleEntries().map((e) => e.name);
    expect(childNames).toContain("..");
    expect(childNames).toContain("inner.txt");

    panel.cleanup();
  });

  it("invokes onOpenFile when the cursor is on a file and pendingViewFile fires", async () => {
    const files = new MemFilesApi();
    await files.write("/note.md", ["hello"]);

    const onOpenFile = vi.fn();
    const panel = createPanelController({ files, title: "Files", onOpenFile });
    await flush();

    const idx = panel.model
      .getVisibleEntries()
      .findIndex((e) => e.name === "note.md");
    expect(idx).toBeGreaterThanOrEqual(0);
    panel.model.cursorIndex = idx;
    panel.model.requestActivateEntry();

    expect(onOpenFile).toHaveBeenCalledWith("/note.md");
    panel.cleanup();
  });

  it("refresh re-navigates to the current path", async () => {
    const files = new MemFilesApi();
    await files.write("/a.txt", ["a"]);
    const panel = createPanelController({ files, title: "Files" });
    await flush();

    await files.write("/b.txt", ["b"]);
    panel.refresh();
    await flush();

    const names = panel.model.getVisibleEntries().map((e) => e.name);
    expect(names).toContain("b.txt");
    panel.cleanup();
  });
});
