import { writeText } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { Secrets, Workspace } from "@statewalker/workspace.core";
import { beforeEach, describe, expect, it } from "vitest";
import { apiKeySecretKey } from "../public/ai-config.js";
import { AiConfigImpl } from "./ai-config.impl.js";

/** Minimal in-memory Secrets for tests. */
class FakeSecrets extends Secrets {
  private readonly map = new Map<string, unknown>();
  readonly gets: string[] = [];
  async get(key: string): Promise<unknown> {
    this.gets.push(key);
    return this.map.get(key);
  }
  async set(key: string, value: unknown): Promise<void> {
    this.map.set(key, value);
  }
  async delete(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
  async list(): Promise<string[]> {
    return [...this.map.keys()];
  }
  onUpdate(): () => void {
    return () => {};
  }
}

function boot(files = new MemFilesApi()): {
  ws: Workspace;
  secrets: FakeSecrets;
  files: MemFilesApi;
} {
  const secrets = new FakeSecrets();
  const ws = new Workspace().setFileSystem(files);
  ws.setAdapter(Secrets, () => secrets);
  return { ws, secrets, files };
}

describe("AiConfigImpl", () => {
  let ctx: ReturnType<typeof boot>;
  let cfg: AiConfigImpl;
  beforeEach(async () => {
    ctx = boot();
    cfg = new AiConfigImpl(ctx.ws);
    await cfg.load();
  });

  it("stores a connection's apiKey in Secrets, never in the config file", async () => {
    await cfg.upsertConnection(
      { id: "openai", type: "openai", name: "OpenAI", starredModelIds: [] },
      "sk-1",
    );
    expect(await ctx.secrets.get(apiKeySecretKey("openai"))).toBe("sk-1");
    const raw = await new Response(ctx.files.read("/.settings/ai-config.json") as never)
      .text()
      .catch(() => "");
    expect(raw).not.toMatch(/sk-1/);
  });

  it("getProvider reads the key from Secrets and builds a provider", async () => {
    await cfg.upsertConnection(
      { id: "openai", type: "openai", name: "OpenAI", starredModelIds: [] },
      "sk-1",
    );
    const provider = await cfg.getProvider("openai");
    expect(typeof provider.languageModel).toBe("function");
    expect(ctx.secrets.gets).toContain(apiKeySecretKey("openai"));
  });

  it("removeConnection deletes the secret", async () => {
    await cfg.upsertConnection(
      { id: "openai", type: "openai", name: "OpenAI", starredModelIds: [] },
      "sk-1",
    );
    await cfg.removeConnection("openai");
    expect(await ctx.secrets.get(apiKeySecretKey("openai"))).toBeUndefined();
    expect(cfg.listConnections()).toEqual([]);
  });

  it("migrates a legacy plaintext apiKey into Secrets on load (one-time)", async () => {
    const files = new MemFilesApi();
    await writeText(
      files,
      "/.settings/ai-config.json",
      JSON.stringify({
        schemaVersion: 5,
        connections: [
          {
            id: "openai",
            type: "openai",
            name: "OpenAI",
            apiKey: "sk-legacy",
            starredModelIds: [],
          },
        ],
        local: { downloaded: [] },
        active: {},
      }),
    );
    const c2 = boot(files);
    const cfg2 = new AiConfigImpl(c2.ws);
    await cfg2.load();
    expect(await c2.secrets.get(apiKeySecretKey("openai"))).toBe("sk-legacy");
    // Re-load: no key left in the file to migrate.
    const cfg3 = new AiConfigImpl(c2.ws);
    await cfg3.load();
    const provider = await cfg3.getProvider("openai");
    expect(typeof provider.languageModel).toBe("function");
  });

  it("refreshModels caches the discovered models; getModels reads the cache + filters", async () => {
    await cfg.upsertConnection(
      { id: "openai", type: "openai", name: "OpenAI", starredModelIds: [] },
      "sk-1",
    );
    const orig = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ data: [{ id: "gpt-4o" }, { id: "text-embedding-3" }] }), {
        status: 200,
      })) as typeof fetch;
    try {
      const models = await cfg.refreshModels("openai");
      expect(models.map((m) => m.id)).toEqual(["gpt-4o", "text-embedding-3"]);
    } finally {
      globalThis.fetch = orig;
    }
    expect(cfg.getModels("openai").map((m) => m.id)).toEqual(["gpt-4o", "text-embedding-3"]);
    // Untagged discovered models default to ["chat"] → present for chat, absent for embedding.
    expect(cfg.getModels("openai", "chat").length).toBe(2);
    expect(cfg.getModels("openai", "embedding").length).toBe(0);
  });
});
