import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { MenuModel } from "./menu-model.js";

export class TopMenuModel extends UIModelRegistry<MenuModel> {}

export const [getTopMenuModel] = newAdapter<TopMenuModel>(
  "aspect:top-menu",
  () => new TopMenuModel(),
);

export const [publishMenu, listenMenu] =
  createModelPoint<MenuModel>(getTopMenuModel);
