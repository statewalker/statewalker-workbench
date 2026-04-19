import { newAdapter } from "@statewalker/shared-adapters";
import type { ActionView } from "../actions/action-view.js";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";

export class ToolbarView extends UIModelRegistry<ActionView> {}

export const [getToolbarView] = newAdapter<ToolbarView>("aspect:toolbar", () => new ToolbarView());

export const [publishToolbarAction, listenToolbarAction] =
  createModelPoint<ActionView>(getToolbarView);
