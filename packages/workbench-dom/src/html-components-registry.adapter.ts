import { newAdapter } from "@statewalker/shared-adapters";
import { ComponentRegistry } from "./component-registry.js";

export type HtmlComponentRegistry = ComponentRegistry<Element>;

export const [getComponentRegistry, setComponentRegistry] =
  newAdapter<HtmlComponentRegistry>(
    "html-components-registry",
    () => new ComponentRegistry<Element>(),
  );
