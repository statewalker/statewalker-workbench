import type { FilesApi } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { describe, expect, it } from "vitest";
import { buildWorkspaceViews } from "../src/impl/composite-setup.ts";

const textEncoder = new TextEncoder();

async function writeString(
  files: FilesApi,
  path: string,
  content: string,
): Promise<void> {
  await files.write(path, [textEncoder.encode(content)]);
}

async function listNames(files: FilesApi, path: string): Promise<string[]> {
  const names: string[] = [];
  for await (const entry of files.list(path)) {
    names.push(entry.name);
  }
  return names.sort();
}

async function seedRoot(): Promise<MemFilesApi> {
  const root = new MemFilesApi();
  await writeString(root, "/docs/readme.md", "# docs");
  await writeString(root, "/src/index.ts", "export {};");
  await writeString(root, "/.settings/secrets/openai.json", '{"k":"v"}');
  await writeString(root, "/.settings/sessions/abc.json", "{}");
  return root;
}

describe("buildWorkspaceViews", () => {
  it("main view hides the system folder from listings", async () => {
    const root = await seedRoot();
    const { main } = buildWorkspaceViews(root, ".settings");

    expect(await listNames(main, "/")).toEqual(["docs", "src"]);
  });

  it("main view rejects operations under the system folder", async () => {
    const root = await seedRoot();
    const { main } = buildWorkspaceViews(root, ".settings");

    expect(await main.exists("/.settings")).toBe(false);
    expect(await main.exists("/.settings/secrets/openai.json")).toBe(false);
    expect(await main.stats("/.settings/secrets/openai.json")).toBeUndefined();
    expect(await main.remove("/.settings/secrets/openai.json")).toBe(false);

    // Read yields no bytes rather than leaking the hidden content.
    const chunks: Uint8Array[] = [];
    for await (const chunk of main.read("/.settings/secrets/openai.json")) {
      chunks.push(chunk);
    }
    expect(chunks).toHaveLength(0);
  });

  it("main view passes through operations outside the system folder", async () => {
    const root = await seedRoot();
    const { main } = buildWorkspaceViews(root, ".settings");

    expect(await main.exists("/docs/readme.md")).toBe(true);
    await writeString(main, "/notes.md", "hi");
    expect(await root.exists("/notes.md")).toBe(true);
  });

  it("system view exposes the system subtree rooted at /", async () => {
    const root = await seedRoot();
    const { system } = buildWorkspaceViews(root, ".settings");

    expect((await listNames(system, "/")).sort()).toEqual([
      "secrets",
      "sessions",
    ]);
    expect(await system.exists("/secrets/openai.json")).toBe(true);

    const chunks: Uint8Array[] = [];
    for await (const chunk of system.read("/secrets/openai.json")) {
      chunks.push(chunk);
    }
    const text = new TextDecoder().decode(concat(chunks));
    expect(text).toBe('{"k":"v"}');
  });

  it("writes through the system view land under the system folder on root", async () => {
    const root = await seedRoot();
    const { system } = buildWorkspaceViews(root, ".settings");

    await writeString(system, "/secrets/new.json", "fresh");
    expect(await root.exists("/.settings/secrets/new.json")).toBe(true);
  });

  it("honors a non-default system directory name", async () => {
    const root = new MemFilesApi();
    await writeString(root, "/data/x.txt", "x");
    await writeString(root, "/.cfg/secrets/k.json", "v");
    const { main, system } = buildWorkspaceViews(root, ".cfg");

    expect(await listNames(main, "/")).toEqual(["data"]);
    expect(await system.exists("/secrets/k.json")).toBe(true);
  });
});

function concat(chunks: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const c of chunks) total += c.byteLength;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
