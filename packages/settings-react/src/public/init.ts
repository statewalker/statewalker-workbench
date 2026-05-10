import { newViewRegistry } from "@statewalker/core-react";
import { provideDockOverlay } from "@statewalker/dock";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { SettingsButton } from "../internal/settings-button.js";
import { SettingsDialog } from "../internal/settings-dialog.js";

const VIEW_KEY_BUTTON = "settings:button";
const VIEW_KEY_DIALOG = "settings:dialog";

/**
 * Renderer-fragment init for `settings-react`. Registers the settings
 * button and dialog views into `core:views` and contributes the dialog
 * to `dock:overlays`. The button view is registered for callers that
 * still want a standalone trigger; the canonical app shell composes
 * Settings into the System menu instead of pinning a top-level button,
 * so this fragment no longer contributes to `dock:header-items`.
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
    provideDockOverlay(slots, {
      id: "settings:dialog",
      viewKey: VIEW_KEY_DIALOG,
    }),
  );

  return cleanup;
}
