import { getIntents, runPreferenceGet, runPreferenceSet } from "@statewalker/platform.api";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { registerPreferenceGetBrowser } from "../src/handlers/preference-get.browser.js";
import { registerPreferenceSetBrowser } from "../src/handlers/preference-set.browser.js";

describe("preference-get/set browser handlers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("round-trips a value through localStorage", async () => {
    const ctx = {};
    const intents = getIntents(ctx);
    const unregisterGet = registerPreferenceGetBrowser(intents);
    const unregisterSet = registerPreferenceSetBrowser(intents);
    try {
      await runPreferenceSet(intents, { key: "k", value: { a: 1, b: [true, "s"] } });
      const result = await runPreferenceGet(intents, { key: "k" });
      expect(result.value).toEqual({ a: 1, b: [true, "s"] });

      // Namespaced under workbench: prefix.
      expect(localStorage.getItem("workbench:k")).toBe(JSON.stringify({ a: 1, b: [true, "s"] }));
    } finally {
      unregisterSet();
      unregisterGet();
    }
  });

  it("returns { value: undefined } for a missing key", async () => {
    const ctx = {};
    const intents = getIntents(ctx);
    const unregisterGet = registerPreferenceGetBrowser(intents);
    try {
      const result = await runPreferenceGet(intents, { key: "never-set" });
      expect(result).toEqual({ value: undefined });
    } finally {
      unregisterGet();
    }
  });

  it("treats a corrupt JSON entry as missing", async () => {
    const ctx = {};
    const intents = getIntents(ctx);
    const unregisterGet = registerPreferenceGetBrowser(intents);
    try {
      localStorage.setItem("workbench:broken", "{not json");
      const result = await runPreferenceGet(intents, { key: "broken" });
      expect(result.value).toBeUndefined();
    } finally {
      unregisterGet();
    }
  });
});
