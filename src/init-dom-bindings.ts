import { newRegistry } from "@repo/shared/registry";
import { bindKeyboard } from "./bind-keyboard.js";
import { bindPointer } from "./bind-pointer.js";

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
  return cleanup;
}
