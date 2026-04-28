import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { DialogView } from "../overlays/dialog-view.js";

/**
 * Dialogs token — workspace-scoped aggregate of currently-visible dialog
 * views. Apps reach the workspace-scoped instance via
 * `workspace.requireAdapter(Dialogs)`; the workspace's adapter system
 * accepts any plain class, so this token does not need to import or
 * implement `WorkspaceAdapter`. The AppShell's dialog viewport subscribes
 * via `onUpdate` and renders every registered dialog.
 */
export class Dialogs extends UIModelRegistry<DialogView> {
  getTopmost(): DialogView | null {
    const items = this.getAll();
    return items.length > 0 ? (items[items.length - 1] ?? null) : null;
  }
}

export { Dialogs as DialogStackView };

export const [getDialogStackView, setDialogStackView] = newAdapter<Dialogs>(
  "aspect:dialogs",
  () => new Dialogs(),
);

export const [publishDialog, listenDialog] = createModelPoint<DialogView>(getDialogStackView);
