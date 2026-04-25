import { newAdapter } from "@statewalker/shared-adapters";
import { createModelPoint, UIModelRegistry } from "../core/ui-model-registry.js";
import type { ToastView } from "./toast-view.js";

/**
 * Aggregate of currently-visible toasts. Mirrors `DialogStackView`: the
 * AppShell's toast viewport subscribes here and renders every entry,
 * removing each one when its timeout elapses or the user dismisses it.
 */
export class ToastStackView extends UIModelRegistry<ToastView> {}

export const [getToastStackView] = newAdapter<ToastStackView>(
  "aspect:toasts",
  () => new ToastStackView(),
);

export const [publishToast, listenToast] = createModelPoint<ToastView>(getToastStackView);
