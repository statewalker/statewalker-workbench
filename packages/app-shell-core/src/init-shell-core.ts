/**
 * Initialises shell core controllers.
 *
 * This is loaded as a fragment, independently of the UI layer.
 * Controllers bridge extension-point registrations (publishPanel, etc.)
 * to the shared model layer (PanelManagerView, etc.).
 */
import { newRegistry } from "@statewalker/shared-registry";
import { getPanelManagerView, listenPanel } from "@statewalker/shared-views";

export function initShellCore(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();
  const panelManager = getPanelManagerView(ctx);

  register(listenPanel(ctx, (panels) => panelManager.syncPanels(panels)));

  return cleanup;
}
