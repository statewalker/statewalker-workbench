import { getIntents, isUserCancelled } from "@statewalker/platform-api";
import { ActionView, publishMenu } from "@statewalker/workbench-views";
import { getWorkspace, runChangeWorkspace, type Workspace } from "@statewalker/workspace-api";

/**
 * Workspace fragment's main controller. Two responsibilities:
 *
 *   1. **Menu item.** Publishes a top-level "Settings" `ActionView` (key
 *      `settings`) with a "Change workspace" sub-action (key
 *      `workspace.change`) into the top-menu registry via `publishMenu`.
 *      Submitting the sub-action re-fires `workspace:change` with empty
 *      payload so the user can rebind at any time.
 *   2. **Bootstrap.** If `getWorkspace(ctx).isOpened === false` at startup,
 *      the controller fires `workspace:change` once so the request-
 *      file-system dialog appears immediately. The user gets a workspace
 *      without the host having to wire any extra UX.
 *
 * `UserCancelledError` rejections from either path are swallowed silently
 * (the user can retry via the menu item). Other rejections are logged via
 * `console.error`.
 *
 * Returns a cleanup that unpublishes the menu item.
 */
export interface StartWorkspaceOptions {
  /**
   * When `true`, the controller publishes the menu item but does NOT fire
   * the bootstrap `workspace:change` intent. Useful for tests, CLI, or
   * MCP harnesses that want to drive activation themselves and avoid the
   * race between bootstrap and explicit `runOpenWorkspace` /
   * `runChangeWorkspace` calls. Defaults to `false` — production hosts
   * want the bootstrap to fire.
   */
  skipBootstrap?: boolean;
}

export function startWorkspace(
  ctx: Record<string, unknown>,
  options: StartWorkspaceOptions = {},
): () => void {
  const intents = getIntents(ctx);

  const action = new ActionView({
    key: "settings",
    label: "Settings",
    icon: "settings",
    children: [
      {
        key: "workspace.change",
        label: "Change workspace",
        execute: () => {
          void runChangeWorkspace(intents, {}).promise.catch((error: unknown) => {
            if (!isUserCancelled(error)) console.error(error);
          });
        },
      },
    ],
  });

  const unpublishMenu = publishMenu(ctx, action);

  if (options.skipBootstrap) return unpublishMenu;

  // `getWorkspace(ctx, true)` returns undefined when no workspace is set
  // yet (i.e., the host did not pre-call `setWorkspace`). In that case the
  // bootstrap intent fires too — change → open will build, open, and
  // register the workspace via the dialog path.
  const workspace = getWorkspace(ctx, true) as Workspace | undefined;
  if (!workspace?.isOpened) {
    void runChangeWorkspace(intents, {}).promise.catch((error: unknown) => {
      if (!isUserCancelled(error)) console.error(error);
    });
  }

  return unpublishMenu;
}
