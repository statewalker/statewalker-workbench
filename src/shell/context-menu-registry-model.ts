import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { ContextMenuModel } from "../overlays/context-menu-model.js";

export class ContextMenuRegistryModel extends UIModelRegistry<ContextMenuModel> {}

export const [getContextMenuRegistryModel] =
  newAdapter<ContextMenuRegistryModel>(
    "aspect:context-menu",
    () => new ContextMenuRegistryModel(),
  );

export const [publishContextMenu, listenContextMenu] =
  createModelPoint<ContextMenuModel>(getContextMenuRegistryModel);
