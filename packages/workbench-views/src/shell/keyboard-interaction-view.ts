import { newAdapter } from "@statewalker/shared-adapters";
import { Keyboard } from "./keyboard-view.js";

export { Keyboard as KeyboardInteractionView };

export const [getKeyboardInteractionView] = newAdapter<Keyboard>(
  "model:keyboard-interaction",
  () => new Keyboard(),
);
