import { getIntents, runCopyToClipboard } from "@statewalker/platform.api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerCopyToClipboardBrowser } from "../src/handlers/copy-to-clipboard.browser.js";

describe("copy-to-clipboard browser handler", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves after navigator.clipboard.writeText succeeds", async () => {
    const ctx = {};
    const unregister = registerCopyToClipboardBrowser(getIntents(ctx));
    try {
      await runCopyToClipboard(getIntents(ctx), { text: "hello" });
      expect(writeText).toHaveBeenCalledWith("hello");
    } finally {
      unregister();
    }
  });

  it("rejects when writeText fails", async () => {
    const ctx = {};
    writeText.mockRejectedValueOnce(new Error("permission denied"));
    const unregister = registerCopyToClipboardBrowser(getIntents(ctx));
    try {
      await expect(runCopyToClipboard(getIntents(ctx), { text: "x" })).rejects.toThrow(
        "permission denied",
      );
    } finally {
      unregister();
    }
  });

  it("unregister makes subsequent fires reject as unhandled", async () => {
    const ctx = {};
    const unregister = registerCopyToClipboardBrowser(getIntents(ctx));
    unregister();
    await expect(runCopyToClipboard(getIntents(ctx), { text: "x" })).rejects.toThrow(
      /unhandled intent/i,
    );
  });
});
