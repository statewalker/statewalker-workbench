import {
  getIntents,
  handlePickDirectory,
  type PickDirectoryResult,
  UserCancelledError,
} from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { afterEach, describe, expect, it } from "vitest";
import initWorkspaceApi from "../src/init.ts";
import { runChangeWorkspace } from "../src/intents/intents.ts";
import { getWorkspace } from "../src/types/workspace.ts";

interface PickStub {
  files: MemFilesApi;
  label: string;
}

function registerPickStub(intents: Intents, picks: PickStub[] | { error: Error }): () => void {
  const queue = Array.isArray(picks) ? [...picks] : null;
  return handlePickDirectory(intents, (intent) => {
    if (!Array.isArray(picks)) {
      intent.reject(picks.error);
      return true;
    }
    const next = queue?.shift();
    if (!next) {
      intent.reject(new Error("pick-directory queue exhausted"));
      return true;
    }
    intent.resolve({
      files: next.files,
      label: next.label,
    } satisfies PickDirectoryResult);
    return true;
  });
}

describe("workspace:change — non-interactive payload", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
  });

  it("rebinds non-interactively when payload.files is supplied (cold start)", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(initWorkspaceApi(ctx));

    const memFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, {
      files: memFs,
      label: "boot",
    }).promise;

    expect(workspace.isOpened).toBe(true);
    expect(workspace.label).toBe("boot");
    expect(workspace.files).toBe(memFs);
  });

  it("preserves workspace identity across rebinds", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(initWorkspaceApi(ctx));

    const first = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, {
      files: first,
      label: "first",
    }).promise;
    expect(workspace.files).toBe(first);

    const second = new MemFilesApi();
    const { workspace: rebinded } = await runChangeWorkspace(intents, {
      files: second,
      label: "second",
    }).promise;

    expect(rebinded).toBe(workspace);
    expect(rebinded.files).toBe(second);
    expect(rebinded.label).toBe("second");
    expect(rebinded.isOpened).toBe(true);
  });

  it("defaults the label to 'Workspace' when payload.label is omitted", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(initWorkspaceApi(ctx));

    const memFs = new MemFilesApi();
    const { workspace } = await runChangeWorkspace(intents, { files: memFs }).promise;
    expect(workspace.label).toBe("Workspace");
  });
});

describe("workspace:change — interactive (pick-directory)", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
  });

  it("opens the workspace against the user-picked files when no payload supplied", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    const picked = new MemFilesApi();
    cleanups.push(registerPickStub(intents, [{ files: picked, label: "P" }]));
    cleanups.push(initWorkspaceApi(ctx));

    const { workspace } = await runChangeWorkspace(intents, {}).promise;
    expect(workspace.isOpened).toBe(true);
    expect(workspace.label).toBe("P");
    expect(workspace.files).toBe(picked);
  });

  it("propagates UserCancelledError when the picker rejects", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerPickStub(intents, { error: new UserCancelledError("nope") }));
    cleanups.push(initWorkspaceApi(ctx));

    await expect(runChangeWorkspace(intents, {}).promise).rejects.toBeInstanceOf(
      UserCancelledError,
    );
    expect(getWorkspace(ctx).isOpened).toBe(false);
  });
});
