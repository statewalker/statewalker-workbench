import {
  Dialogs,
  Keyboard,
  Layout,
  MainMenu,
  setDialogStackView,
  setKeyboardView,
  setPanelManagerView,
  setToastStackView,
  setToolbarView,
  setTopMenuView,
  Toasts,
  Toolbar,
} from "@statewalker/workbench-views";
import { getWorkspace } from "@statewalker/workspace-api";

/**
 * Pull every shell-aspect adapter from the workspace and publish each
 * onto the application context using its corresponding ctx-bag setter.
 *
 * Producers (mountFilesPanel, controllers) and consumers (AppShell, the
 * workbench-react renderers) historically reach for shell aspects via
 * legacy `getX(ctx)` accessors AND the new `workspace.requireAdapter(X)`
 * call. Without this bridge those two paths resolve to different
 * instances — the ctx-bag accessors lazily create their own singleton
 * the first time they are called, which is *not* the one held by
 * `workspace.requireAdapter(X)`. Calling `bridgeShellAdapters(ctx)`
 * eagerly seeds ctx with the workspace's canonical instances so every
 * downstream lookup observes the same object.
 *
 * Must run BEFORE any consumer touches `getX(ctx)`. In practice that
 * means `initWorkspace(ctx)` should be wired before `initShadcn(ctx)`
 * (or any other init that calls `initShellCore`).
 */
export function bridgeShellAdapters(ctx: Record<string, unknown>): void {
  const ws = getWorkspace(ctx);
  setPanelManagerView(ctx, ws.requireAdapter(Layout));
  setKeyboardView(ctx, ws.requireAdapter(Keyboard));
  setDialogStackView(ctx, ws.requireAdapter(Dialogs));
  setToastStackView(ctx, ws.requireAdapter(Toasts));
  setTopMenuView(ctx, ws.requireAdapter(MainMenu));
  setToolbarView(ctx, ws.requireAdapter(Toolbar));
}
