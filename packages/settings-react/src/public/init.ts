import { newViewRegistry } from "@statewalker/core-react";
import { provideDockHeaderItem, provideDockOverlay } from "@statewalker/dock";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { SettingsButton } from "../internal/settings-button.js";
import { SettingsDialog } from "../internal/settings-dialog.js";

const VIEW_KEY_BUTTON = "settings:button";
const VIEW_KEY_DIALOG = "settings:dialog";

/**
 * Renderer-fragment init for `settings-react`. Registers the settings
 * button and dialog into the `core:views` slot and contributes them to
 * `dock:header-items` and `dock:overlays` respectively.
 */
export default function initSettingsReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const views = newViewRegistry(workspace);
  const slots = workspace.requireAdapter(Slots);

  register(
    views.register(
      VIEW_KEY_BUTTON,
      SettingsButton as unknown as Parameters<typeof views.register>[1],
    ),
  );
  register(
    views.register(
      VIEW_KEY_DIALOG,
      SettingsDialog as unknown as Parameters<typeof views.register>[1],
    ),
  );
  register(
    provideDockHeaderItem(slots, {
      id: "settings:button",
      slot: "trailing",
      order: 50,
      viewKey: VIEW_KEY_BUTTON,
    }),
  );
  register(
    provideDockOverlay(slots, {
      id: "settings:dialog",
      viewKey: VIEW_KEY_DIALOG,
    }),
  );

  return cleanup;
}
