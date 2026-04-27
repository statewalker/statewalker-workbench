/**
 * Verify every shell-aspect class exposed by `workbench-views` works as a
 * workspace-bound adapter token. The Workspace's adapter system accepts
 * any plain class (structural match against the optional `init`/`close`
 * lifecycle hooks), so these classes don't need to import `WorkspaceAdapter`.
 */
import { Workspace } from "@statewalker/workspace-api";
import { describe, expect, it } from "vitest";
import { Toasts } from "../feedback/toast-stack-view.js";
import { Navigation } from "../navigation/url-state-view.js";
import { ContextMenus } from "./context-menu-registry-view.js";
import { Dialogs } from "./dialog-stack-view.js";
import { Dnd } from "./dnd-interaction-view.js";
import { Keyboard } from "./keyboard-view.js";
import { Layout } from "./panel-manager-view.js";
import { Pointer } from "./pointer-interaction-view.js";
import { Theme } from "./theme-view.js";
import { Toolbar } from "./toolbar-view.js";
import { MainMenu } from "./top-menu-view.js";

// biome-ignore lint/suspicious/noExplicitAny: heterogeneous tokens iterated in one loop
type AnyTokenCtor = abstract new (...args: any[]) => object;

const tokens: ReadonlyArray<readonly [string, AnyTokenCtor]> = [
  ["Layout", Layout],
  ["Keyboard", Keyboard],
  ["Dialogs", Dialogs],
  ["MainMenu", MainMenu],
  ["Toolbar", Toolbar],
  ["Theme", Theme],
  ["Toasts", Toasts],
  ["ContextMenus", ContextMenus],
  ["Pointer", Pointer],
  ["Dnd", Dnd],
  ["Navigation", Navigation],
];

for (const [name, Token] of tokens) {
  describe(`${name} as a workspace adapter token`, () => {
    it("is a class (callable with new)", () => {
      expect(typeof Token).toBe("function");
      expect(Token.prototype).toBeTruthy();
    });

    it("requireAdapter auto-instantiates without explicit setAdapter", () => {
      const ws = new Workspace();
      const instance = ws.requireAdapter(Token);
      expect(instance).toBeInstanceOf(Token);
    });

    it("two consecutive requireAdapter calls return the same identity", () => {
      const ws = new Workspace();
      const a = ws.requireAdapter(Token);
      const b = ws.requireAdapter(Token);
      expect(a).toBe(b);
    });

    it("the constructor runs exactly once across multiple lookups", () => {
      let constructed = 0;
      // biome-ignore lint/suspicious/noExplicitAny: subclass spans heterogeneous tokens
      class Counted extends (Token as new (...args: any[]) => object) {
        // biome-ignore lint/suspicious/noExplicitAny: matches base ctor
        constructor(...args: any[]) {
          super(...args);
          constructed += 1;
        }
      }
      const ws = new Workspace();
      ws.setAdapter(Token, Counted);
      ws.requireAdapter(Token);
      ws.requireAdapter(Token);
      ws.requireAdapter(Token);
      expect(constructed).toBe(1);
    });
  });
}
