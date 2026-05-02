import { isUserCancelled } from "@statewalker/platform-api";
import { Intents } from "@statewalker/shared-intents";
import { MainMenu } from "@statewalker/workbench-views";
import { getWorkspace, runChangeWorkspace } from "@statewalker/workspace-api";
import { addSettingsMenuItem } from "./add-top-menu";

/**
 * Workspace fragment's main controller. Publishes a top-level "Settings"
 * `ActionView` (key `settings`) with a "Change workspace" sub-action (key
 * `workspace.change`) into the top-menu registry via `publishMenu`.
 * Submitting the sub-action re-fires `workspace:change` with empty
 * payload so the user can rebind at any time.
 *
 * Note: the controller does NOT auto-fire `workspace:change` on boot.
 * Browser security forbids `showDirectoryPicker` outside a user gesture,
 * so picker-driven activation must originate from a real click — typically
 * the empty-state CTA in the files-panel or this Settings menu item. CLI /
 * MCP / integration hosts drive activation directly via
 * `runChangeWorkspace(intents, { files, label })`.
 *
 * `UserCancelledError` rejections are swallowed silently (the user can
 * retry); other rejections are logged via `console.error`.
 *
 * Returns a cleanup that unpublishes the menu item.
 */
export function startWorkspace(ctx: Record<string, unknown>): () => void {
  const workspace = getWorkspace(ctx);
  const intents = workspace.requireAdapter(Intents);
  const topMenu = workspace.requireAdapter(MainMenu);
  return addSettingsMenuItem(topMenu, {
    key: "workspace.change",
    label: "Change workspace",
    icon: "folder-key",
    execute: () => {
      void runChangeWorkspace(intents, {}).promise.catch((error: unknown) => {
        if (!isUserCancelled(error)) console.error(error);
      });
    },
  });
}
