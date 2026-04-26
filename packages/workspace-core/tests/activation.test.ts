import {
  getIntents,
  handlePickDirectory,
  handlePreferenceGet,
  UserCancelledError,
} from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import {
  type DialogView,
  EmptyView,
  getDialogStackView,
  getTopMenuView,
} from "@statewalker/workbench-views";
import { getWorkspace, runChangeWorkspace, setWorkspace } from "@statewalker/workspace-api";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildWorkspace } from "../src/impl/build-workspace.ts";
import { initWorkspace } from "../src/init.ts";

const config = {
  systemDir: ".settings",
  secretsDir: "secrets",
  settingsDir: "settings",
  sessionsDir: "",
  modelsDir: "models",
} as const;

function registerNoPreferences(intents: Intents): () => void {
  return handlePreferenceGet(intents, (intent) => {
    intent.resolve({ value: undefined });
    return true;
  });
}

interface TestApp {
  ctx: Record<string, unknown>;
  intents: Intents;
  pickStub: { invocations: number; nextFs: () => FilesApi; nextLabel: string };
  loadCount: () => number;
  cleanups: Array<() => void>;
}

/**
 * The "tiny test application" the activation spec calls for. Wires
 * `setWorkspace` (when `preopen` is true), a stub `pick-directory`, a
 * `preference-get` stub, and a counter on `workspace.onLoad`.
 */
function makeTestApp(opts: { preopen: boolean }): TestApp {
  const ctx: Record<string, unknown> = {};
  const intents = getIntents(ctx);
  const cleanups: Array<() => void> = [];

  // Pick stub: yields a fresh MemFilesApi each call.
  const pickStub = {
    invocations: 0,
    nextLabel: "test-fixture",
    nextFs: () => new MemFilesApi(),
  };
  cleanups.push(
    handlePickDirectory(intents, (intent) => {
      pickStub.invocations++;
      intent.resolve({ files: pickStub.nextFs(), label: pickStub.nextLabel });
      return true;
    }),
  );
  cleanups.push(registerNoPreferences(intents));

  // onLoad counter — installed on whatever Workspace is in ctx after the
  // bootstrap settles. We expose a closure that subscribes lazily.
  let count = 0;
  const ensureSubscription = () => {
    const ws = getWorkspace(ctx, true);
    if (ws) {
      ws.onLoad(() => {
        count++;
      });
    }
  };

  if (opts.preopen) {
    const ws = buildWorkspace(ctx, new MemFilesApi(), "preopen", config);
    setWorkspace(ctx, ws);
  }

  return {
    ctx,
    intents,
    pickStub,
    cleanups,
    loadCount: () => {
      ensureSubscription();
      return count;
    },
  };
}

/**
 * Stub renderer that auto-submits the EmptyView's primary action on
 * every published `DialogView`. Triggers the dialog's runPickDirectory
 * call and lets the factory close the dialog with the sentinel label.
 */
function registerAutoConfirmDialog(ctx: Record<string, unknown>): () => void {
  const stack = getDialogStackView(ctx);
  const seen = new WeakSet<DialogView>();
  const driveAll = () => {
    for (const view of stack.getAll()) {
      if (seen.has(view)) continue;
      seen.add(view);
      const empty = view.children.find((c) => c instanceof EmptyView) as EmptyView | undefined;
      empty?.action?.submit();
    }
  };
  driveAll();
  return stack.onUpdate(driveAll);
}

/**
 * Stub renderer that immediately dismisses every published `DialogView`.
 */
function registerAutoDismissDialog(ctx: Record<string, unknown>): () => void {
  const stack = getDialogStackView(ctx);
  const seen = new WeakSet<DialogView>();
  const dismiss = () => {
    for (const view of stack.getAll()) {
      if (seen.has(view)) continue;
      seen.add(view);
      view.close(undefined);
      stack.remove(view);
    }
  };
  dismiss();
  return stack.onUpdate(dismiss);
}

describe("workspace.core / activation integration", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
    vi.restoreAllMocks();
  });

  it("scenario 1 — non-interactive activation skips the dialog entirely", async () => {
    const app = makeTestApp({ preopen: false });
    cleanups.push(...app.cleanups);
    cleanups.push(initWorkspace(app.ctx, { skipBootstrap: true }));

    const memFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(app.intents, { files: memFs, label: "boot" })
      .promise;

    expect(workspace.isOpened).toBe(true);
    expect(workspace.files).toBe(memFs);
    expect(getDialogStackView(app.ctx).getAll()).toEqual([]);
    expect(app.pickStub.invocations).toBe(0);
  });

  it("scenario 2 — cold-start dialog-driven activation opens the workspace", async () => {
    const app = makeTestApp({ preopen: false });
    cleanups.push(...app.cleanups);
    cleanups.push(registerAutoConfirmDialog(app.ctx));
    cleanups.push(initWorkspace(app.ctx));

    // Wait for the bootstrap promise chain to settle.
    await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const ws = getWorkspace(app.ctx, true);
    expect(ws).toBeDefined();
    expect(ws?.isOpened).toBe(true);
    expect(app.pickStub.invocations).toBeGreaterThanOrEqual(1);
    expect(app.loadCount()).toBeGreaterThanOrEqual(1);
  });

  it("scenario 3 — submitting the menu action re-fires change with a fresh FilesApi", async () => {
    const app = makeTestApp({ preopen: true });
    cleanups.push(...app.cleanups);
    cleanups.push(initWorkspace(app.ctx, { skipBootstrap: true }));

    cleanups.push(registerAutoConfirmDialog(app.ctx));

    const settings = getTopMenuView(app.ctx)
      .getAll()
      .find((a) => a.actionKey === "settings");
    const action = settings?.getChild("workspace.change");
    expect(action).toBeDefined();

    const before = app.loadCount();
    action?.submit();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(app.loadCount()).toBeGreaterThan(before);
    expect(app.pickStub.invocations).toBeGreaterThanOrEqual(1);
  });

  it("scenario 4 — cleanup tears down the menu and unregisters handlers", async () => {
    const app = makeTestApp({ preopen: true });
    cleanups.push(...app.cleanups);
    const teardown = initWorkspace(app.ctx, { skipBootstrap: true });

    expect(
      getTopMenuView(app.ctx)
        .getAll()
        .some((a) => a.actionKey === "settings"),
    ).toBe(true);

    teardown();

    expect(
      getTopMenuView(app.ctx)
        .getAll()
        .some((a) => a.actionKey === "settings"),
    ).toBe(false);
    const intent = runChangeWorkspace(app.intents, {});
    expect(intent.settled).toBe(false);
  });

  it("scenario 5 — UserCancelledError is swallowed silently by the bootstrap path", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = makeTestApp({ preopen: false });
    cleanups.push(...app.cleanups);
    cleanups.push(registerAutoDismissDialog(app.ctx));
    cleanups.push(initWorkspace(app.ctx));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const ws = getWorkspace(app.ctx, true);
    // Workspace may have been built (open-handler creates one before the
    // dialog appears) but should NOT be opened against any FilesApi if the
    // dialog was dismissed.
    if (ws) {
      expect(ws.isOpened).toBe(false);
    }
    // The bootstrap's own catch-handler should swallow UserCancelledError.
    const cancelLogs = errorSpy.mock.calls.filter((call) =>
      call.some((arg) => arg instanceof UserCancelledError),
    );
    expect(cancelLogs).toEqual([]);
  });
});
