import { Intents } from "@statewalker/shared-intents";
import { describe, expect, it } from "vitest";
import { Workspace } from "../src/types/workspace.ts";

describe("Intents as a workspace adapter", () => {
  it("requireAdapter(Intents) auto-instantiates without explicit setAdapter", () => {
    const ws = new Workspace();
    const bus = ws.requireAdapter(Intents);
    expect(bus).toBeInstanceOf(Intents);
  });

  it("two consecutive requireAdapter(Intents) calls return the same identity", () => {
    const ws = new Workspace();
    const a = ws.requireAdapter(Intents);
    const b = ws.requireAdapter(Intents);
    expect(a).toBe(b);
  });

  it("auto-instantiation cycle-detection allows Intents (constructor does no recursive requireAdapter)", () => {
    const ws = new Workspace();
    expect(() => ws.requireAdapter(Intents)).not.toThrow();
  });

  it("dispatch through the workspace-bound bus reaches handlers registered through it", () => {
    const ws = new Workspace();
    const bus = ws.requireAdapter(Intents);

    let received: string | null = null;
    bus.addHandler<{ msg: string }, void>("hello", (intent) => {
      received = intent.payload.msg;
      return true;
    });

    bus.run("hello", { msg: "hi" });
    expect(received).toBe("hi");
  });
});
