import {
  COPY_TO_CLIPBOARD_INTENT_KEY,
  DOWNLOAD_BLOB_INTENT_KEY,
  DOWNLOAD_TO_FILES_INTENT_KEY,
  getIntents,
  PICK_DIRECTORY_INTENT_KEY,
  PICK_FILE_INTENT_KEY,
  PREFERENCE_GET_INTENT_KEY,
  PREFERENCE_SET_INTENT_KEY,
  runCopyToClipboard,
  runPreferenceSet,
} from "@statewalker/platform.api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import initPlatformWeb from "../src/index.js";

const PLATFORM_INTENT_KEYS = [
  PICK_DIRECTORY_INTENT_KEY,
  PICK_FILE_INTENT_KEY,
  DOWNLOAD_TO_FILES_INTENT_KEY,
  COPY_TO_CLIPBOARD_INTENT_KEY,
  DOWNLOAD_BLOB_INTENT_KEY,
  PREFERENCE_GET_INTENT_KEY,
  PREFERENCE_SET_INTENT_KEY,
];

describe("platform.browser initPlatformWeb(ctx)", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn(() => Promise.resolve()) },
      configurable: true,
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("registers all seven handlers and cleanup unregisters them", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanup = initPlatformWeb(ctx);
    expect(cleanup).toBeTypeOf("function");

    // Quick sanity: two handler-backed intents resolve after init.
    await expect(runCopyToClipboard(getIntents(ctx), { text: "x" })).resolves.toBeUndefined();
    await expect(
      runPreferenceSet(getIntents(ctx), { key: "t", value: 1 }),
    ).resolves.toBeUndefined();

    // After cleanup, every platform intent rejects as unhandled.
    await cleanup();
    for (const key of PLATFORM_INTENT_KEYS) {
      await expect(getIntents(ctx).run(key, {})).rejects.toThrow(/unhandled intent/i);
    }
  });
});
