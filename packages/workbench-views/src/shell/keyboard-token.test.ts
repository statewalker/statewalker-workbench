/**
 * Verify the `Keyboard` token's surface (binding registration + interaction
 * state) works through `workspace.requireAdapter(Keyboard)`.
 */
import { Workspace } from "@statewalker/workspace-api";
import { describe, expect, it } from "vitest";
import { Keyboard } from "./keyboard-view.js";

describe("Keyboard token", () => {
  it("bind registers a key handler that fires on key", () => {
    const ws = new Workspace();
    const keyboard = ws.requireAdapter(Keyboard);
    let fired = 0;
    keyboard.bind({ key: "F3", execute: () => fired++ });
    keyboard.fire("F3");
    expect(fired).toBe(1);
  });

  it("the disposer returned by bind removes the handler", () => {
    const ws = new Workspace();
    const keyboard = ws.requireAdapter(Keyboard);
    let fired = 0;
    const dispose = keyboard.bind({ key: "Enter", execute: () => fired++ });
    keyboard.fire("Enter");
    dispose();
    keyboard.fire("Enter");
    expect(fired).toBe(1);
  });

  it("pressKey records the latest key and notifies subscribers", () => {
    const ws = new Workspace();
    const keyboard = ws.requireAdapter(Keyboard);
    let count = 0;
    keyboard.onUpdate(() => count++);
    keyboard.pressKey("ArrowDown");
    expect(keyboard.key).toBe("ArrowDown");
    expect(count).toBe(1);
  });
});
