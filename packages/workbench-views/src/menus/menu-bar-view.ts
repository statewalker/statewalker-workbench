import { ContainerView } from "../core/index.js";
import type { MenuTriggerView } from "./menu-trigger-view.js";

export class MenuBarView extends ContainerView<MenuTriggerView> {
  constructor(options?: {
    key?: string;
    children?: MenuTriggerView[];
  }) {
    super({ key: options?.key, children: options?.children });
  }
}
