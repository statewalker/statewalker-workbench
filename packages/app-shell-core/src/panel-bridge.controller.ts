/**
 * Bridges publishPanel extension point → PanelManagerView.
 *
 * Listens for panel registrations/removals via listenPanel and keeps
 * PanelManagerView in sync. This is the controller-layer wiring that
 * was previously embedded in the React AppShell component.
 */
import { newRegistry } from "@statewalker/shared-registry";
import { getPanelManagerView, listenPanel } from "@statewalker/shared-views";

export function createPanelBridgeController(
  ctx: Record<string, unknown>,
): () => void {
  const [register, cleanup] = newRegistry();
  const panelManager = getPanelManagerView(ctx);
  const knownKeys = new Set<string>();

  register(
    listenPanel(ctx, (panels) => {
      const currentKeys = new Set(panels.map((p) => p.key));
      for (const p of panels) {
        if (!knownKeys.has(p.key)) {
          knownKeys.add(p.key);
          panelManager.addPanel(p);
        }
      }
      for (const key of knownKeys) {
        if (!currentKeys.has(key)) {
          knownKeys.delete(key);
          panelManager.removePanel(key);
        }
      }
    }),
  );

  return cleanup;
}
