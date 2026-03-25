import { newExtensionPoint } from "@repo/shared/extensions";
import type { CommandModel } from "./command-model.js";
import type { DialogModel } from "./dialog-model.js";
import type { MenuModel } from "./menu-model.js";
import type { ContextMenuModel } from "./overlay/context-menu-model.js";
import type { PanelModel } from "./panel-model.js";

export const [publishPanel, listenPanel] =
  newExtensionPoint<PanelModel>("model:panel");

export const [publishMenu, listenMenu] =
  newExtensionPoint<MenuModel>("model:menu");

export const [publishDialog, listenDialog] =
  newExtensionPoint<DialogModel>("model:dialog");

export const [publishCommand, listenCommand] =
  newExtensionPoint<CommandModel>("model:command");

export const [publishContextMenu, listenContextMenu] =
  newExtensionPoint<ContextMenuModel>("model:context-menu");
