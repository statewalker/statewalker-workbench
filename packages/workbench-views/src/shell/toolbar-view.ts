import { newAdapter } from "@statewalker/shared-adapters";
import type { ActionView } from "../actions/action-view.js";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";

/**
 * Toolbar token — workspace-scoped registry of toolbar action models. Apps
 * reach the workspace-scoped instance via `workspace.requireAdapter(Toolbar)`;
 * the workspace's adapter system accepts any plain class, so this token does
 * not need to import or implement `WorkspaceAdapter`.
 */
export class Toolbar extends UIModelRegistry<ActionView> {}

export { Toolbar as ToolbarView };

export const [getToolbarView, setToolbarView] = newAdapter<Toolbar>(
  "aspect:toolbar",
  () => new Toolbar(),
);

export const [publishToolbarAction, listenToolbarAction] =
  createModelPoint<ActionView>(getToolbarView);
