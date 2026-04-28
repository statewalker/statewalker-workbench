import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { ToastView } from "./toast-view.js";

/**
 * Toasts token — workspace-scoped aggregate of currently-visible toasts.
 * Apps reach the workspace-scoped instance via
 * `workspace.requireAdapter(Toasts)`; the workspace's adapter system
 * accepts any plain class, so this token does not need to import or
 * implement `WorkspaceAdapter`. The AppShell's toast viewport subscribes
 * here and renders every entry, removing each one when its timeout elapses
 * or the user dismisses it.
 */
export class Toasts extends UIModelRegistry<ToastView> {}

export { Toasts as ToastStackView };

export const [getToastStackView, setToastStackView] = newAdapter<Toasts>(
  "aspect:toasts",
  () => new Toasts(),
);

export const [publishToast, listenToast] = createModelPoint<ToastView>(getToastStackView);
