/// <reference path="./htl.d.ts" />
export { html, svg } from "htl";
export { bindDialogStack } from "./bind-dialog-stack.js";
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
