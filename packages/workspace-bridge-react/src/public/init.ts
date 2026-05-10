import { newViewRegistry } from "@statewalker/core-react";
import { provideDockHeaderItem } from "@statewalker/dock";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { SwitchWorkspaceButton } from "../internal/switch-workspace-button.js";
import { WorkspaceLabelHeader } from "../internal/workspace-label-header.js";

const VIEW_KEY_LABEL = "workspace:label-header";
const VIEW_KEY_SWITCH = "workspace:switch-button";

/**
 * Renderer-fragment init for workspace-bridge-react (per ADR 0002).
 * Registers the two header views into the `core:views` slot and
 * contributes them to `dock:header-items`:
 *   - workspace label (slot `leading`)
 *   - switch-workspace button (slot `trailing`)
 *
 * The `<AppWorkspaceProvider/>` and `<DirectoryPickerEmptyState/>`
 * components are imported directly by `core-react`'s `<AppRoot/>` and
 * `<App/>`; they are not registered into any slot.
 */
export default function initWorkspaceBridgeReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const views = newViewRegistry(workspace);
  const slots = workspace.requireAdapter(Slots);

  register(
    views.register(
      VIEW_KEY_LABEL,
      WorkspaceLabelHeader as unknown as Parameters<typeof views.register>[1],
    ),
  );
  register(
    views.register(
      VIEW_KEY_SWITCH,
      SwitchWorkspaceButton as unknown as Parameters<typeof views.register>[1],
    ),
  );
  register(
    provideDockHeaderItem(slots, {
      id: "workspace:label",
      slot: "leading",
      order: 0,
      viewKey: VIEW_KEY_LABEL,
    }),
  );
  // The Switch-workspace button view is registered above so callers
  // can mount it standalone, but the canonical shell composes it into
  // the System menu — no `dock:header-items` contribution from here.

  return cleanup;
}
