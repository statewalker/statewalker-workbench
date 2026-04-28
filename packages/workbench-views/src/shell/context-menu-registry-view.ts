import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { ContextMenuView } from "../overlays/context-menu-view.js";

/**
 * ContextMenus token — workspace-scoped registry of currently-open context
 * menu views. Apps reach the workspace-scoped instance via
 * `workspace.requireAdapter(ContextMenus)`; the workspace's adapter system
 * accepts any plain class, so this token does not need to import or
 * implement `WorkspaceAdapter`.
 */
export class ContextMenus extends UIModelRegistry<ContextMenuView> {}

export { ContextMenus as ContextMenuRegistryView };

export const [getContextMenuRegistryView] = newAdapter<ContextMenus>(
  "aspect:context-menu",
  () => new ContextMenus(),
);

export const [publishContextMenu, listenContextMenu] = createModelPoint<ContextMenuView>(
  getContextMenuRegistryView,
);
