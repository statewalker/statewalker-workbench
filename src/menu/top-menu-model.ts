import { newAdapter } from "@repo/shared/adapters";
import type { MenuModel } from "../menu-model.js";
import {
  createModelPoint,
  UIModelRegistry,
} from "../models/ui-model-registry.js";

export class TopMenuModel extends UIModelRegistry<MenuModel> {}

export const [getTopMenuModel] = newAdapter<TopMenuModel>(
  "aspect:top-menu",
  () => new TopMenuModel(),
);

export const [publishMenu, listenMenu] =
  createModelPoint<MenuModel>(getTopMenuModel);
