import { newAdapter } from "@repo/shared/adapters";
import { BaseClass } from "@repo/shared/models";

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
