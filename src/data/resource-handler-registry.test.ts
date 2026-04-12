import { describe, expect, it, vi } from "vitest";
import { ResourceHandlerRegistry } from "./resource-handler-registry.js";

describe("ResourceHandlerRegistry", () => {
  describe("icon handlers", () => {
    it("registers and looks up by extension pattern", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIcon("*.md", () => ({ icon: "file-text", color: "blue" }));

      const result = reg.getIcon("readme.md");
      expect(result).toEqual({ icon: "file-text", color: "blue" });
    });

    it("returns undefined for unregistered extension", () => {
      const reg = new ResourceHandlerRegistry();
      expect(reg.getIcon("file.xyz")).toBeUndefined();
    });

    it("longest suffix wins", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIcon("*.ts", () => ({ icon: "ts" }));
      reg.registerIcon("*.test.ts", () => ({ icon: "test-ts" }));

      expect(reg.getIcon("foo.test.ts")?.icon).toBe("test-ts");
      expect(reg.getIcon("foo.ts")?.icon).toBe("ts");
    });

    it("MIME fallback when no extension match", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIconByMime("text/plain", () => ({
        icon: "file-text",
      }));

      expect(reg.getIcon("noext", "text/plain")?.icon).toBe("file-text");
    });

    it("extension takes priority over MIME", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIcon("*.md", () => ({ icon: "markdown" }));
      reg.registerIconByMime("text/markdown", () => ({
        icon: "mime-markdown",
      }));

      expect(reg.getIcon("readme.md", "text/markdown")?.icon).toBe("markdown");
    });

    it("dispose removes handler", () => {
      const reg = new ResourceHandlerRegistry();
      const dispose = reg.registerIcon("*.md", () => ({ icon: "md" }));

      expect(reg.getIcon("readme.md")).toBeDefined();
      dispose();
      expect(reg.getIcon("readme.md")).toBeUndefined();
    });
  });

  describe("opener handlers", () => {
    it("registers and looks up opener", () => {
      const reg = new ResourceHandlerRegistry();
      const handler = vi.fn();
      reg.registerOpener("*.pdf", handler);

      const opener = reg.getOpener("doc.pdf");
      expect(opener).toBe(handler);
    });
  });

  describe("visualizer handlers", () => {
    it("registers and looks up visualizer", () => {
      const reg = new ResourceHandlerRegistry();
      const handler = vi.fn().mockReturnValue(null);
      reg.registerVisualizer("*.png", handler);

      const viz = reg.getVisualizer("image.png");
      expect(viz).toBe(handler);
    });
  });

  describe("URI handling", () => {
    it("handles collectionId:path URIs", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIcon("*.ts", () => ({ icon: "ts" }));

      expect(reg.getIcon("ws:/src/index.ts")?.icon).toBe("ts");
    });

    it("handles nested paths", () => {
      const reg = new ResourceHandlerRegistry();
      reg.registerIcon("*.json", () => ({ icon: "json" }));

      expect(reg.getIcon("/a/b/c/config.json")?.icon).toBe("json");
    });
  });

  describe("notifications", () => {
    it("notifies on registration", () => {
      const reg = new ResourceHandlerRegistry();
      const listener = vi.fn();
      reg.onUpdate(listener);

      reg.registerIcon("*.md", () => ({ icon: "md" }));
      expect(listener).toHaveBeenCalledOnce();
    });

    it("notifies on disposal", () => {
      const reg = new ResourceHandlerRegistry();
      const dispose = reg.registerIcon("*.md", () => ({ icon: "md" }));

      const listener = vi.fn();
      reg.onUpdate(listener);

      dispose();
      expect(listener).toHaveBeenCalledOnce();
    });
  });
});
