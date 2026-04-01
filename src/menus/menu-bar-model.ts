import { ContainerModel } from "../core/index.js";
import type { MenuTriggerModel } from "./menu-trigger-model.js";

export class MenuBarModel extends ContainerModel<MenuTriggerModel> {
  constructor(options?: {
    key?: string;
    children?: MenuTriggerModel[];
  }) {
    super({ key: options?.key, children: options?.children });
  }
}
