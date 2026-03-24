import { newAdapter } from "@repo/shared/adapters";
import type { ComponentRegistry } from "./component-registry.js";

export type HtmlComponentRegistry = ComponentRegistry<Element>;

export const [getComponentRegistry, setComponentRegistry] =
  newAdapter<HtmlComponentRegistry>("html-components-registry");
