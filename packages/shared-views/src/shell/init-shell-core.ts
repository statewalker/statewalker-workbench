/**
 * Initialises shell core controllers.
 *
 * Loaded as a fragment, independently of the UI layer. Bridges the
 * `publishPanel` extension point to `PanelManagerView` so a shell
 * boot sequence is just `initShellCore(ctx)` followed by
 * `bootstrap(manifest, ctx)`.
 */
import { getPanelManagerView } from "./panel-manager-view.js";
import { listenPanel } from "./panel-view.js";

export function initShellCore(ctx: Record<string, unknown>): () => void {
  const panelManager = getPanelManagerView(ctx);

  return listenPanel(ctx, (panels) => panelManager.syncPanels(panels));
}
