import {
  COPY_TO_CLIPBOARD_INTENT_KEY, CopyToClipboardCommand, DOWNLOAD_BLOB_INTENT_KEY, DOWNLOAD_TO_FILES_INTENT_KEY, PICK_DIRECTORY_INTENT_KEY, PICK_FILE_INTENT_KEY, PREFERENCE_GET_INTENT_KEY, PREFERENCE_SET_INTENT_KEY, PreferenceSetCommand, getIntents
} from "@statewalker/platform-api";
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
    await expect(
      getIntents(ctx).call(CopyToClipboardCommand, { text: "x" }).promise,
    ).resolves.toBeUndefined();
    await expect(
      getIntents(ctx).call(PreferenceSetCommand, { key: "t", value: 1 }).promise,
    ).resolves.toBeUndefined();

    // After cleanup, every platform command stays unsettled (no listener,
    // no default rejection — the noop default leaves it pending so the
    // caller can supply external resolution if needed).
    await cleanup();
    for (const key of PLATFORM_INTENT_KEYS) {
      const cmd = getIntents(ctx).call({ key, defaultFn: () => {} }, {});
      expect(cmd.settled).toBe(false);
    }
  });
});
