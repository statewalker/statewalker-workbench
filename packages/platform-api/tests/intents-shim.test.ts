import { Intents } from "@statewalker/shared-intents";
import { getWorkspace } from "@statewalker/workspace-api";
import { describe, expect, it, vi } from "vitest";
import { getIntents, removeIntents, setIntents } from "../src/adapters.ts";

describe("getIntents shim", () => {
  it("returns the same instance as workspace.requireAdapter(Intents) for the same ctx", () => {
    const ctx: Record<string, unknown> = {};
    const fromShim = getIntents(ctx);
    const fromWorkspace = getWorkspace(ctx).requireAdapter(Intents);
    expect(fromShim).toBe(fromWorkspace);
  });

  it("returns the same instance across calls on the same ctx", () => {
    const ctx: Record<string, unknown> = {};
    const a = getIntents(ctx);
    const b = getIntents(ctx);
    expect(a).toBe(b);
  });

  it("returns an Intents instance", () => {
    const ctx: Record<string, unknown> = {};
    expect(getIntents(ctx)).toBeInstanceOf(Intents);
  });

  it("returns distinct instances for distinct ctx (each ctx gets its own workspace)", () => {
    const a = getIntents({});
    const b = getIntents({});
    expect(a).not.toBe(b);
  });
});

describe("setIntents / removeIntents — deprecation no-op semantics", () => {
  it("setIntents does not replace the workspace-bound bus", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const ctx: Record<string, unknown> = {};
      const original = getIntents(ctx);
      const mock = new Intents();
      setIntents(ctx, mock);
      const after = getIntents(ctx);
      expect(after).toBe(original);
      expect(after).not.toBe(mock);
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it("removeIntents does not detach the workspace-bound bus", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const ctx: Record<string, unknown> = {};
      const original = getIntents(ctx);
      removeIntents(ctx);
      const after = getIntents(ctx);
      expect(after).toBe(original);
      expect(getWorkspace(ctx).requireAdapter(Intents)).toBe(original);
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});
