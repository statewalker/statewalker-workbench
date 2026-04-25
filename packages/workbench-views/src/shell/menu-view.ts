// Menu types are now unified under ActionView.
// These re-exports preserve backward compatibility.

export type {
  ActionViewConfig as MenuConfig,
  ActionViewConfig as MenuItemConfig,
} from "../actions/action-view.js";
export {
  ActionView as MenuItem,
  ActionView as MenuModel,
} from "../actions/action-view.js";
