/**
 * Initialises shell core controllers.
 *
 * This is loaded as a fragment, independently of the UI layer.
 * Controllers bridge extension-point registrations (publishPanel, etc.)
 * to the shared model layer (PanelManagerView, etc.).
 */
import { newRegistry } from "@repo/shared-registry";
import { createPanelBridgeController } from "./panel-bridge.controller.js";

export function initShellCore(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();

  register(createPanelBridgeController(ctx));

  return cleanup;
}
