import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { MenuModel } from "./menu-view.js";

/**
 * MainMenu token — workspace-scoped registry of top-menu entries. Apps
 * reach the workspace-scoped instance via `workspace.requireAdapter(MainMenu)`;
 * the workspace's adapter system accepts any plain class, so this token does
 * not need to import or implement `WorkspaceAdapter`.
 */
export class MainMenu extends UIModelRegistry<MenuModel> {}

export { MainMenu as TopMenuView };

export const [getTopMenuView, setTopMenuView] = newAdapter<MainMenu>(
  "aspect:top-menu",
  () => new MainMenu(),
);

export const [publishMenu, listenMenu] = createModelPoint<MenuModel>(getTopMenuView);
