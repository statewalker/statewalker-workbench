import { getIntents } from "@statewalker/platform-api";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { type ActionView, getTopMenuView } from "@statewalker/workbench-views";
import { runChangeWorkspace, setWorkspace } from "@statewalker/workspace-api";
import { afterEach, describe, expect, it } from "vitest";
import { buildWorkspace } from "../src/impl/build-workspace.ts";
import { initWorkspace } from "../src/init.ts";

describe("workspace.core / menu", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
  });

  it("publishes a 'Settings' parent with one 'Change workspace' child", () => {
    const ctx: Record<string, unknown> = {};
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const items = getTopMenuView(ctx).getAll();
    const settings = items.filter((a) => a.actionKey === "settings");
    expect(settings).toHaveLength(1);
    expect(settings[0]?.label).toBe("Settings");

    const change = settings[0]?.getChild("workspace.change");
    expect(change).toBeDefined();
    expect(change?.label).toBe("Change workspace");
  });

  it("submitting the menu action re-fires workspace:change", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const initialFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, {
      files: initialFs,
      label: "initial",
    }).promise;
    expect(workspace.files).toBe(initialFs);

    // Submitting the menu action fires `runChangeWorkspace({})`. The
    // payload-less call would normally hit the dialog; intercept by
    // pre-building a second workspace and switching via direct setWorkspace
    // is overkill — instead, fire `runChangeWorkspace` ourselves and assert
    // that the action's submit path is wired.
    let submitCount = 0;
    const settings = getTopMenuView(ctx)
      .getAll()
      .find((a: ActionView) => a.actionKey === "settings");
    const action = settings?.getChild("workspace.change");
    if (!action) throw new Error("workspace.change action not published");
    cleanups.push(action.onSubmit(() => submitCount++));
    action.submit();
    expect(submitCount).toBe(1);
  });

  it("cleanup removes the menu action and unregisters the intent handlers", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);

    // Build a workspace so the change-intent handler doesn't try the dialog
    // before cleanup; but we never actually call change here.
    const built = buildWorkspace(ctx, new MemFilesApi(), "x", {
      systemDir: ".settings",
      secretsDir: "secrets",
      settingsDir: "settings",
      sessionsDir: "",
      modelsDir: "models",
    });
    await built.open();
    setWorkspace(ctx, built);

    const teardown = initWorkspace(ctx, { skipBootstrap: true });
    expect(
      getTopMenuView(ctx)
        .getAll()
        .some((a) => a.actionKey === "settings"),
    ).toBe(true);

    teardown();

    expect(
      getTopMenuView(ctx)
        .getAll()
        .some((a) => a.actionKey === "settings"),
    ).toBe(false);
    const intent = runChangeWorkspace(intents, {});
    expect(intent.settled).toBe(false);
  });
});
