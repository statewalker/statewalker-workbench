// Menu types are now unified under ActionModel.
// These re-exports preserve backward compatibility.

export type {
  ActionConfig as MenuConfig,
  ActionConfig as MenuItemConfig,
} from "../actions/action-model.js";
export {
  ActionModel as MenuItem,
  ActionModel as MenuModel,
} from "../actions/action-model.js";
