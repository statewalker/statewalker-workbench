import initWorkspaceApi from "@statewalker/workspace-api";
import { bridgeShellAdapters } from "./bridge-shell-adapters.js";
import { startWorkspace } from "./main.controller.js";

/**
 * Fragment-shaped entry point for the workspace.
 *
 * 1. Bridges the workspace's canonical shell-aspect adapters
 *    (`Layout`, `Keyboard`, `Dialogs`, `Toasts`) onto `ctx` so legacy
 *    `getX(ctx)` accessors and `workspace.requireAdapter(X)` resolve to
 *    the same instances. This MUST run before any consumer (notably
 *    `initShellCore` / the Shadcn AppShell) lazily creates a separate
 *    ctx-bound singleton.
 * 2. Registers the `workspace:change` intent handler.
 * 3. Publishes the "Settings → Change workspace" menu item.
 *
 * Returns a cleanup that tears the controller down and unregisters the
 * intent handler in reverse order.
 */
export function initWorkspace(ctx: Record<string, unknown>): () => void {
  bridgeShellAdapters(ctx);
  const cleanups: Array<() => void> = [initWorkspaceApi(ctx), startWorkspace(ctx)];
  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
  };
}

export default initWorkspace;
