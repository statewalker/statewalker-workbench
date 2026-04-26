import { getIntents, handlePreferenceGet, UserCancelledError } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { type DialogView, getDialogStackView } from "@statewalker/workbench-views";
import { runChangeWorkspace, setWorkspace } from "@statewalker/workspace-api";
import { afterEach, describe, expect, it } from "vitest";
import { buildWorkspace } from "../src/impl/build-workspace.ts";
import { initWorkspace } from "../src/init.ts";

function registerNoPreferences(intents: Intents): () => void {
  return handlePreferenceGet(intents, (intent) => {
    intent.resolve({ value: undefined });
    return true;
  });
}

/**
 * Stub renderer that subscribes to `DialogStackView` and dismisses every
 * published `DialogView` by calling `view.close(undefined)` (Cancel/Esc
 * semantics). Returns a cleanup that unsubscribes.
 */
function registerAutoDismissDialog(ctx: Record<string, unknown>): () => void {
  const stack = getDialogStackView(ctx);
  const seen = new WeakSet<DialogView>();
  const dismissAll = () => {
    for (const view of stack.getAll()) {
      if (seen.has(view)) continue;
      seen.add(view);
      view.close(undefined);
      stack.remove(view);
    }
  };
  dismissAll();
  return stack.onUpdate(dismissAll);
}

describe("workspace.core / change-workspace cancel", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
  });

  it("rejects with UserCancelledError when the dialog is dismissed", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    // Pre-build an opened workspace so the change-handler hits the rebind path
    // (which goes through the dialog when no payload is supplied).
    const initialFs = new MemFilesApi();
    await runChangeWorkspace(intents, { files: initialFs, label: "initial" }).promise;

    cleanups.push(registerAutoDismissDialog(ctx));

    await expect(runChangeWorkspace(intents, {}).promise).rejects.toBeInstanceOf(
      UserCancelledError,
    );
  });

  it("does not mutate the workspace when the dialog is dismissed", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const initialFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, {
      files: initialFs,
      label: "initial",
    }).promise;
    expect(workspace.files).toBe(initialFs);
    expect(workspace.isOpened).toBe(true);

    cleanups.push(registerAutoDismissDialog(ctx));
    await expect(runChangeWorkspace(intents, {}).promise).rejects.toBeInstanceOf(
      UserCancelledError,
    );

    // FilesApi unchanged; workspace still opened against the initial fs.
    expect(workspace.files).toBe(initialFs);
    expect(workspace.isOpened).toBe(true);
  });

  it("removes the dismissed DialogView from the registry", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    // Set the workspace directly (skip the open-handler) so we don't need
    // to wire a pick-directory stub here — this test only exercises the
    // dialog-cancel path.
    const built = buildWorkspace(ctx, new MemFilesApi(), "x", {
      systemDir: ".settings",
      secretsDir: "secrets",
      settingsDir: "settings",
      sessionsDir: "",
      modelsDir: "models",
    });
    await built.open();
    setWorkspace(ctx, built);

    cleanups.push(registerAutoDismissDialog(ctx));
    await expect(runChangeWorkspace(intents, {}).promise).rejects.toBeInstanceOf(
      UserCancelledError,
    );
    expect(getDialogStackView(ctx).getAll()).toEqual([]);
  });
});
