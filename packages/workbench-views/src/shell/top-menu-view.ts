import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { MenuModel } from "./menu-view.js";

export class TopMenuView extends UIModelRegistry<MenuModel> {}

export const [getTopMenuView] = newAdapter<TopMenuView>("aspect:top-menu", () => new TopMenuView());

export const [publishMenu, listenMenu] = createModelPoint<MenuModel>(getTopMenuView);
