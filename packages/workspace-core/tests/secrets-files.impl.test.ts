import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { describe, expect, it } from "vitest";
import { SecretsFilesImpl } from "../src/impl/secrets-files.impl.ts";

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("SecretsFilesImpl", () => {
  it("round-trips a JSON value through FilesApi", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });

    await secrets.set("ai:provider:openai", {
      apiKey: "sk-test",
      kind: "openai",
    });
    const got = await secrets.get("ai:provider:openai");
    expect(got).toEqual({ apiKey: "sk-test", kind: "openai" });
  });

  it("encodes colons so the on-disk filename is filesystem-safe", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });

    await secrets.set("ai:provider:openai", "sk-test");
    const entries: string[] = [];
    for await (const entry of files.list("/secrets")) {
      entries.push(entry.path);
    }
    expect(entries).toHaveLength(1);
    const filename = entries[0] ?? "";
    expect(filename).toContain("ai%3Aprovider%3Aopenai");
    expect(filename.endsWith(".json")).toBe(true);
  });

  it("list returns every stored key (decoded) and delete removes the backing file", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });

    await secrets.set("ai:provider:openai", "a");
    await secrets.set("ai:provider:anthropic", "b");
    await secrets.set("workspace:last-handle", { token: "opaque" });

    const keys = await secrets.list();
    expect(keys.sort()).toEqual([
      "ai:provider:anthropic",
      "ai:provider:openai",
      "workspace:last-handle",
    ]);

    expect(await secrets.delete("ai:provider:anthropic")).toBe(true);
    expect(await secrets.get("ai:provider:anthropic")).toBeUndefined();
    expect((await secrets.list()).sort()).toEqual([
      "ai:provider:openai",
      "workspace:last-handle",
    ]);
  });

  it("returns undefined for missing keys", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });
    expect(await secrets.get("never-set")).toBeUndefined();
  });

  it("coalesces rapid writes into a single onUpdate notification", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });

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

  it("unsubscribing onUpdate stops further notifications", async () => {
    const files = new MemFilesApi();
    const secrets = new SecretsFilesImpl({ files, secretsDir: "secrets" });

    const calls: string[][] = [];
    const unsubscribe = secrets.onUpdate((keys) => calls.push([...keys]));

    await secrets.set("a", 1);
    await flushMicrotasks();
    expect(calls).toHaveLength(1);

    unsubscribe();
    await secrets.set("b", 2);
    await flushMicrotasks();
    expect(calls).toHaveLength(1);
  });
});
