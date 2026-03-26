import { newAdapter } from "@repo/shared/adapters";
import type { ActionModel } from "../action-model.js";
import {
  createModelPoint,
  UIModelRegistry,
} from "../models/ui-model-registry.js";

export class ToolbarModel extends UIModelRegistry<ActionModel> {}

export const [getToolbarModel] = newAdapter<ToolbarModel>(
  "aspect:toolbar",
  () => new ToolbarModel(),
);

export const [publishToolbarAction, listenToolbarAction] =
  createModelPoint<ActionModel>(getToolbarModel);
