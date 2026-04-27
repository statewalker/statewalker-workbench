import initWorkspaceApi from "@statewalker/workspace-api";
import { type StartWorkspaceOptions, startWorkspace } from "./main.controller.js";

export interface InitWorkspaceOptions extends StartWorkspaceOptions {}

/**
 * Fragment-shaped entry point for the workspace.
 *
 * Composes the workspace-api init (which registers the
 * `workspace:change` intent handler against the default `Workspace`
 * instance from `getWorkspace(ctx)`) with the main controller (which
 * publishes the "Settings → Change workspace" menu item and fires the
 * bootstrap intent if the workspace is not yet opened).
 *
 * Returns a cleanup that tears the controller down and unregisters the
 * intent handler in reverse order.
 */
export function initWorkspace(
  ctx: Record<string, unknown>,
  options: InitWorkspaceOptions = {},
): () => void {
  const cleanups: Array<() => void> = [initWorkspaceApi(ctx), startWorkspace(ctx, options)];
  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
  };
}

export default initWorkspace;
