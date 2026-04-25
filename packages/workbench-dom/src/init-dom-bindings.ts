import { newRegistry } from "@statewalker/shared-registry";
import { bindDialogStack } from "./bind-dialog-stack.js";
import { bindKeyboard } from "./bind-keyboard.js";
import { bindPointer } from "./bind-pointer.js";
import { bindTheme } from "./bind-theme.js";

/**
 * Initialize all DOM bindings for the shared interaction models.
 * Call as a fragment: register(initDomBindings(ctx)).
 *
 * Returns a cleanup function that removes all DOM listeners.
 */
export function initDomBindings(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();
  register(bindKeyboard(ctx));
  register(bindPointer(ctx));
  register(bindTheme(ctx));
  register(bindDialogStack(ctx));
  return cleanup;
}
