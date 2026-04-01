import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { ContextMenuView } from "../overlays/context-menu-view.js";

export class ContextMenuRegistryView extends UIModelRegistry<ContextMenuView> {}

export const [getContextMenuRegistryView] = newAdapter<ContextMenuRegistryView>(
  "aspect:context-menu",
  () => new ContextMenuRegistryView(),
);

export const [publishContextMenu, listenContextMenu] =
  createModelPoint<ContextMenuView>(getContextMenuRegistryView);
