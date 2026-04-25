import { getIntents, handlePreferenceGet } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { getDialogStackView } from "@statewalker/workbench-views";
import { runChangeWorkspace } from "@statewalker/workspace-api";
import { afterEach, describe, expect, it } from "vitest";
import { initWorkspace } from "../src/init.ts";

function registerNoPreferences(intents: Intents): () => void {
  return handlePreferenceGet(intents, (intent) => {
    intent.resolve({ value: undefined });
    return true;
  });
}

describe("workspace.core / change-workspace payload override", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
  });

  it("rebinds non-interactively when payload.files is supplied (cold start)", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const memFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, { files: memFs, label: "boot" });

    expect(workspace.isOpened).toBe(true);
    expect(workspace.label).toBe("boot");
    expect(workspace.files).toBe(memFs);
    expect(getDialogStackView(ctx).getAll()).toEqual([]);
  });

  it("rebinds non-interactively when payload.files is supplied (existing workspace)", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const first = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, { files: first, label: "first" });
    expect(workspace.files).toBe(first);

    const second = new MemFilesApi();
    const { workspace: rebinded } = await runChangeWorkspace(intents, {
      files: second,
      label: "second",
    });

    expect(rebinded).toBe(workspace); // workspace identity preserved
    expect(rebinded.files).toBe(second);
    expect(rebinded.label).toBe("second");
    expect(rebinded.isOpened).toBe(true);
    expect(getDialogStackView(ctx).getAll()).toEqual([]);
  });

  it("defaults the label to 'Workspace' when payload.label is omitted", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspace(ctx, { skipBootstrap: true }));

    const memFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, { files: memFs });
    expect(workspace.label).toBe("Workspace");
  });
});
