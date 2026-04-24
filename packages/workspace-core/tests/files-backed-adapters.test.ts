import { Secrets, Settings, SystemFiles } from "@statewalker/workspace-api";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { describe, expect, it } from "vitest";
import { buildWorkspace } from "../src/impl/build-workspace.ts";

const textEncoder = new TextEncoder();

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function config() {
  return {
    systemDir: ".settings",
    secretsDir: "secrets",
    settingsDir: "settings",
    sessionsDir: "",
    modelsDir: "models",
  };
}

describe("FilesBackedSecrets", () => {
  it("round-trips a JSON value via the workspace adapter", async () => {
    const root = new MemFilesApi();
    const ws = buildWorkspace({}, root, "A", config());
    await ws.open();

    const secrets = ws.requireAdapter(Secrets);
    await secrets.set("ai:provider:openai", { apiKey: "sk-test" });
    expect(await secrets.get("ai:provider:openai")).toEqual({
      apiKey: "sk-test",
    });
    expect(secrets.isLocked).toBe(false);
  });

  it("coalesces rapid writes into a single onUpdate callback", async () => {
    const root = new MemFilesApi();
    const ws = buildWorkspace({}, root, "A", config());
    await ws.open();
    const secrets = ws.requireAdapter(Secrets);

    const calls: string[][] = [];
    secrets.onUpdate((keys) => calls.push([...keys]));

    await Promise.all([
      secrets.set("a", 1),
      secrets.set("b", 2),
      secrets.set("c", 3),
    ]);
    await flushMicrotasks();

    expect(calls).toHaveLength(1);
    expect([...(calls[0] ?? [])].sort()).toEqual(["a", "b", "c"]);
  });
});

describe("FilesBackedSettings", () => {
  it("round-trips values into a subtree distinct from Secrets", async () => {
    const root = new MemFilesApi();
    const ws = buildWorkspace({}, root, "A", config());
    await ws.open();

    const settings = ws.requireAdapter(Settings);
    const secrets = ws.requireAdapter(Secrets);

    await settings.set("theme", "dark");
    await secrets.set("api-key", "s");

    expect((await settings.list()).sort()).toEqual(["theme"]);
    expect((await secrets.list()).sort()).toEqual(["api-key"]);

    // Verify on-disk separation: entries must not cross subtrees.
    expect(await root.exists("/.settings/settings/theme.json")).toBe(true);
    expect(await root.exists("/.settings/secrets/api-key.json")).toBe(true);
  });
});

describe("FilesBackedSystemFiles", () => {
  it("exposes the systemDir subtree via workspace.requireAdapter(SystemFiles)", async () => {
    const root = new MemFilesApi();
    await root.write("/README.md", [textEncoder.encode("hi")]);
    const ws = buildWorkspace({}, root, "A", config());
    await ws.open();

    const systemFiles = ws.requireAdapter(SystemFiles).files;
    await systemFiles.write("/marker.txt", [textEncoder.encode("x")]);
    expect(await root.exists("/.settings/marker.txt")).toBe(true);

    // workspace.files is the raw root — system subtree is visible from it.
    const rootEntries: string[] = [];
    for await (const entry of ws.files.list("/")) rootEntries.push(entry.name);
    expect(rootEntries.sort()).toEqual([".settings", "README.md"]);
  });
});
