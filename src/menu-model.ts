// Menu types are now unified under ActionModel.
// These re-exports preserve backward compatibility.

export type {
  ActionConfig as MenuConfig,
  ActionConfig as MenuItemConfig,
} from "./action-model.js";
export {
  ActionModel as MenuItem,
  ActionModel as MenuModel,
} from "./action-model.js";
