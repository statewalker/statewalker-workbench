/// <reference path="./htl.d.ts" />
export { html, svg } from "htl";
export { bindDialogStack } from "./bind-dialog-stack.js";
export { bindKeyboard } from "./bind-keyboard.js";
export { bindPointer } from "./bind-pointer.js";
export { bindTheme } from "./bind-theme.js";
export {
  type ComponentFactory,
  ComponentRegistry,
  type Constructor,
} from "./component-registry.js";
export type { HtmlComponentRegistry } from "./html-components-registry.adapter.js";
export {
  getComponentRegistry,
  setComponentRegistry,
} from "./html-components-registry.adapter.js";
export { initDomBindings } from "./init-dom-bindings.js";
