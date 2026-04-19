import { newAdapter } from "@statewalker/shared-adapters";
import { BaseClass } from "@statewalker/shared-baseclass";

/**
 * Low-level interaction model for keyboard events.
 * DOM bindings write raw key presses here.
 * Controllers subscribe and interpret key presses in context.
 */
export class KeyboardInteractionView extends BaseClass {
  key = "";

  pressKey(key: string): void {
    this.key = key;
    this.notify();
  }
}

export const [getKeyboardInteractionView] =
  newAdapter<KeyboardInteractionView>(
    "model:keyboard-interaction",
    () => new KeyboardInteractionView(),
  );
