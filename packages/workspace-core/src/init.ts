import { registerChangeWorkspaceHandler } from "./handlers/change-workspace.handler.ts";
import { registerOpenWorkspaceHandler } from "./handlers/open-workspace.handler.ts";
import { type StartWorkspaceOptions, startWorkspace } from "./main.controller.ts";

export interface InitWorkspaceOptions extends StartWorkspaceOptions {}

/**
 * Fragment-shaped entry point for the workspace.
 *
 * Registers the `workspace:open` and `workspace:change` intent handlers
 * AND starts the main controller (which publishes the
 * "Change workspace folder…" menu item and fires the bootstrap intent if
 * the workspace is not already opened).
 *
 * Host responsibilities BEFORE calling `initWorkspace`:
 *   - `setWorkspace(ctx, buildWorkspace(ctx, …))` — register a `Workspace`
 *     instance under adapter key `workspace:workspace`.
 *   - Mount a `DialogStackView` renderer — typically by mounting the
 *     workbench `AppShell` from one of the React bindings, or by calling
 *     `bindDialogStack(ctx)` from `@statewalker/workbench-dom` for plain
 *     DOM hosts.
 *   - Register a `pick-directory` handler — `registerPickDirectoryBrowser`
 *     from `@statewalker/platform-browser`, or a Node/test stub.
 *   - (Optional) `setIntents(ctx, …)` if the host doesn't want the
 *     auto-created default Intents bus.
 *
 * Returns a cleanup that unregisters both intent handlers and tears down
 * the main controller's menu in reverse order of registration.
 */
export function initWorkspace(
  ctx: Record<string, unknown>,
  options: InitWorkspaceOptions = {},
): () => void {
  const cleanups = [
    registerOpenWorkspaceHandler(ctx),
    registerChangeWorkspaceHandler(ctx),
    startWorkspace(ctx, options),
  ];
  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) {
      cleanups[i]?.();
    }
  };
}

export default initWorkspace;
