import type { PickDirectoryResult } from "@statewalker/platform-api";
import { getIntents, handlePickDirectory, handlePreferenceGet } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { type DialogView, EmptyView, getDialogStackView } from "@statewalker/workbench-views";
import {
  getWorkspace,
  runChangeWorkspace,
  runOpenWorkspace,
  Secrets,
  SystemFiles,
} from "@statewalker/workspace-api";
import { afterEach, describe, expect, it, vi } from "vitest";
import initWorkspaceCore from "../src/init.ts";

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
 * Stub renderer that subscribes to `DialogStackView` and synchronously
 * submits the primary `ActionView` of every published `DialogView`'s
 * `EmptyView` body. Lets these handler-focused tests drive the new
 * dialog path without spinning up a real UI binding — the action's
 * `submit()` triggers the `runPickDirectory` call (which the existing
 * pick-stub answers) and closes the dialog. Returns a cleanup that
 * unsubscribes.
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

describe("workspace.core / handlers", () => {
  let cleanups: Array<() => void> = [];

  afterEach(() => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
    cleanups = [];
    vi.restoreAllMocks();
  });

  it("open assembles a Workspace and publishes it in the opened state", async () => {
    const ctx: Record<string, unknown> = {};
    const root = await seededRoot();
    const intents = getIntents(ctx);

    cleanups.push(registerPickStub(intents, [{ files: root, label: "project-a" }]));
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx, { skipBootstrap: true }));
    cleanups.push(registerAutoConfirmDialog(ctx));

    const { workspace } = await runOpenWorkspace(intents, {}).promise;

    expect(workspace.isOpened).toBe(true);
    expect(workspace.label).toBe("project-a");
    expect(getWorkspace(ctx)).toBe(workspace);

    const systemFiles = workspace.requireAdapter(SystemFiles).files;
    const secrets = workspace.requireAdapter(Secrets);

    // System view is rooted at .settings
    const systemEntries: string[] = [];
    for await (const entry of systemFiles.list("/")) systemEntries.push(entry.name);
    expect(systemEntries).toEqual(["secrets"]);

    // workspace.files is the raw root — system subtree is visible.
    const rootEntries: string[] = [];
    for await (const entry of workspace.files.list("/")) rootEntries.push(entry.name);
    expect(rootEntries.sort()).toEqual([".settings", "README.md"]);

    expect(await secrets.get("ai:provider:openai")).toEqual({
      apiKey: "sk-test",
    });
  });

  it("re-opens short-circuits to the live workspace without re-prompting", async () => {
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
    cleanups.push(initWorkspaceCore(ctx, { skipBootstrap: true }));
    cleanups.push(registerAutoConfirmDialog(ctx));

    await runOpenWorkspace(intents, {}).promise;
    expect(pickHandler).toHaveBeenCalledTimes(1);

    const { workspace } = await runOpenWorkspace(intents, {}).promise;
    expect(pickHandler).toHaveBeenCalledTimes(1);
    expect(workspace.label).toBe("first");
  });

  it("force=true preserves workspace identity and rebinds the file system", async () => {
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
    cleanups.push(initWorkspaceCore(ctx, { skipBootstrap: true }));
    cleanups.push(registerAutoConfirmDialog(ctx));

    const { workspace: initial } = await runOpenWorkspace(intents, {}).promise;
    const initialSecrets = initial.requireAdapter(Secrets);

    const { workspace: reopened } = await runOpenWorkspace(intents, {
      force: true,
    }).promise;

    expect(reopened).toBe(initial);
    expect(reopened.label).toBe("second");
    expect(reopened.isOpened).toBe(true);

    const freshSecrets = reopened.requireAdapter(Secrets);
    expect(freshSecrets).not.toBe(initialSecrets);

    const mainEntries: string[] = [];
    for await (const entry of reopened.files.list("/")) mainEntries.push(entry.name);
    expect(mainEntries).toEqual(["HELLO.md"]);
  });

  it("change: fires onUnload then onLoad in order; preserves workspace identity; returns fresh adapters", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(
      registerPickStub(intents, [
        { files: await seededRoot(), label: "first" },
        { files: new MemFilesApi(), label: "second" },
      ]),
    );
    cleanups.push(registerNoPreferences(intents));
    cleanups.push(initWorkspaceCore(ctx, { skipBootstrap: true }));
    cleanups.push(registerAutoConfirmDialog(ctx));

    const { workspace } = await runOpenWorkspace(intents, {}).promise;
    const firstSecrets = workspace.requireAdapter(Secrets);

    const order: string[] = [];
    // onLoad fires synchronously when subscribing to an already-opened workspace.
    workspace.onLoad(() => order.push("load"));
    workspace.onUnload(() => order.push("unload"));
    expect(order).toEqual(["load"]);

    const { workspace: changed } = await runChangeWorkspace(intents, {}).promise;
    expect(changed).toBe(workspace);
    expect(order).toEqual(["load", "unload", "load"]);

    const secondSecrets = workspace.requireAdapter(Secrets);
    expect(secondSecrets).not.toBe(firstSecrets);
  });

  it("runs headless under Node without any browser shim", () => {
    expect(typeof globalThis.document).toBe("undefined");
    expect(typeof globalThis.window).toBe("undefined");
    const ctx: Record<string, unknown> = {};
    cleanups.push(initWorkspaceCore(ctx, { skipBootstrap: true }));
  });

  it("cleanup unregisters handlers so subsequent fires stay unhandled", async () => {
    const ctx: Record<string, unknown> = {};
    const intents = getIntents(ctx);
    cleanups.push(registerPickStub(intents, [{ files: await seededRoot(), label: "once" }]));
    cleanups.push(registerNoPreferences(intents));
    const teardown = initWorkspaceCore(ctx);
    teardown();

    const intent = runOpenWorkspace(intents, {});
    expect(intent.settled).toBe(false);
  });
});
