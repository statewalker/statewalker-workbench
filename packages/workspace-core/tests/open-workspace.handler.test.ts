import type { SecretsApi, Workspace } from "@statewalker/workspace-api";
import {
  getFilesApi,
  getSecretsApi,
  getSystemFilesApi,
  getWorkspace,
  runChangeWorkspace,
  runOpenWorkspace,
} from "@statewalker/workspace-api";
import type { PickDirectoryResult } from "@statewalker/platform.api";
import {
  getIntents,
  handlePickDirectory,
  handlePreferenceGet,
} from "@statewalker/platform.api";
import type { Intents } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { afterEach, describe, expect, it, vi } from "vitest";
import initWorkspaceCore from "../src/init-workspace-core.ts";

const textEncoder = new TextEncoder();

async function seededRoot(): Promise<MemFilesApi> {
  const root = new MemFilesApi();
  await root.write("/README.md", [textEncoder.encode("# workspace")]);
  await root.write("/.settings/secrets/ai%3Aprovider%3Aopenai.json", [
    textEncoder.encode(JSON.stringify({ apiKey: "sk-test" })),
  ]);
  return root;
}

interface PickStub {
  files: FilesApi;
  label: string;
}

/**
 * Register a stub `platform:pick-directory` handler that resolves with the
 * supplied sequence of picks. Each `runPickDirectory` call pops the next
 * entry; reject if the sequence is exhausted.
 */
function registerPickStub(intents: Intents, picks: PickStub[]): () => void {
  const queue = [...picks];
  return handlePickDirectory(intents, (intent) => {
    const next = queue.shift();
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

function registerNoPreferences(intents: Intents): () => void {
  return handlePreferenceGet(intents, (intent) => {
    intent.resolve({ value: undefined });
    return true;
  });
}

/**
 * Drain pending microtasks so coalesced notifications flush.
 */
async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("workspace.core / runOpenWorkspace", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
    vi.restoreAllMocks();
  });

  it("assembles a Workspace via the platform pick-directory intent", async () => {
    const ctx: Record<string, unknown> = {};
    const root = await seededRoot();
    const intents = getIntents(ctx);

    cleanups.push(
      registerPickStub(intents, [{ files: root, label: "project-a" }]),
    );
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx));

    const { workspace } = await runOpenWorkspace(intents, {});

    expect(workspace.label).toBe("project-a");
    expect(getWorkspace(ctx)).toBe(workspace);
    expect(getFilesApi(ctx)).toBeDefined();
    expect(getSystemFilesApi(ctx)).toBeDefined();
    expect(getSecretsApi(ctx)).toBeDefined();

    // main view hides the system folder
    const mainTopLevel: string[] = [];
    for await (const entry of getFilesApi(ctx).list("/"))
      mainTopLevel.push(entry.name);
    expect(mainTopLevel.sort()).toEqual(["README.md"]);

    // system view shows the system subtree
    const systemTopLevel: string[] = [];
    for await (const entry of getSystemFilesApi(ctx).list("/"))
      systemTopLevel.push(entry.name);
    expect(systemTopLevel).toEqual(["secrets"]);

    // Secrets round-trip via the injected system view
    const secrets: SecretsApi = getSecretsApi(ctx);
    expect(await secrets.get("ai:provider:openai")).toEqual({
      apiKey: "sk-test",
    });
  });

  it("re-opens short-circuits to the live workspace without calling the picker", async () => {
    const ctx: Record<string, unknown> = {};
    const root = await seededRoot();
    const intents = getIntents(ctx);

    const pickHandler = vi.fn();
    cleanups.push(
      handlePickDirectory(intents, (intent) => {
        pickHandler();
        intent.resolve({
          files: root,
          label: "first",
        } satisfies PickDirectoryResult);
        return true;
      }),
    );
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx));

    await runOpenWorkspace(intents, {});
    expect(pickHandler).toHaveBeenCalledTimes(1);

    // Second call without force should not invoke the picker again.
    const { workspace } = await runOpenWorkspace(intents, {});
    expect(pickHandler).toHaveBeenCalledTimes(1);
    expect(workspace.label).toBe("first");
  });

  it("force=true reprompts and swaps the live workspace in place", async () => {
    const ctx: Record<string, unknown> = {};
    const firstRoot = await seededRoot();
    const secondRoot = new MemFilesApi();
    await secondRoot.write("/HELLO.md", [textEncoder.encode("hi")]);
    const intents = getIntents(ctx);

    cleanups.push(
      registerPickStub(intents, [
        { files: firstRoot, label: "first" },
        { files: secondRoot, label: "second" },
      ]),
    );
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx));

    const { workspace: initial } = await runOpenWorkspace(intents, {});
    const listener = vi.fn();
    (initial as Workspace).onUpdate(listener);

    const { workspace: reopened } = await runOpenWorkspace(intents, {
      force: true,
    });
    expect(reopened).toBe(initial); // same identity; fields swapped in place
    expect(reopened.label).toBe("second");
    expect(listener).toHaveBeenCalledTimes(1);

    // Adapter reflects the new view
    const mainEntries: string[] = [];
    for await (const entry of getFilesApi(ctx).list("/"))
      mainEntries.push(entry.name);
    expect(mainEntries).toEqual(["HELLO.md"]);
  });

  it("runChangeWorkspace notifies observers exactly once", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(
      registerPickStub(intents, [
        { files: await seededRoot(), label: "first" },
        { files: new MemFilesApi(), label: "second" },
      ]),
    );
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx));

    const { workspace } = await runOpenWorkspace(intents, {});
    const listener = vi.fn();
    workspace.onUpdate(listener);

    const { workspace: changed } = await runChangeWorkspace(intents, {});
    expect(changed).toBe(workspace);
    await settle();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("runs headless under Node without any browser shim", () => {
    expect(typeof globalThis.document).toBe("undefined");
    expect(typeof globalThis.window).toBe("undefined");
    // Merely importing + activating the core must not throw.
    const ctx: Record<string, unknown> = {};
    cleanups.push(initWorkspaceCore(ctx));
  });

  it("cleanup unregisters handlers so subsequent fires reject as unhandled", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(
      registerPickStub(intents, [{ files: await seededRoot(), label: "once" }]),
    );
    cleanups.push(registerNoPreferences(intents));
    const teardown = initWorkspaceCore(ctx);
    teardown();

    await expect(runOpenWorkspace(intents, {})).rejects.toThrow(
      /unhandled intent/i,
    );
  });
});
