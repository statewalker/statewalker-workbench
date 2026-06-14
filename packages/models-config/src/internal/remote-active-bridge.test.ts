import { ActiveModel } from "@statewalker/ai-agent-runtime";
import { AiConfigImpl } from "@statewalker/ai-config";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { Secrets, Workspace } from "@statewalker/workspace.core";
import { afterEach, describe, expect, it } from "vitest";
import { applyRemoteActive } from "./remote-active-bridge.js";

class FakeSecrets extends Secrets {
  private readonly map = new Map<string, unknown>();
  async get(k: string): Promise<unknown> {
    return this.map.get(k);
  }
  async set(k: string, v: unknown): Promise<void> {
    this.map.set(k, v);
  }
  async delete(k: string): Promise<boolean> {
    return this.map.delete(k);
  }
  async list(): Promise<string[]> {
    return [...this.map.keys()];
  }
  onUpdate(): () => void {
    return () => {};
  }
}

async function bootConfig(): Promise<AiConfigImpl> {
  const ws = new Workspace().setFileSystem(new MemFilesApi());
  ws.setAdapter(Secrets, () => new FakeSecrets());
  const cfg = new AiConfigImpl(ws);
  await cfg.load();
  return cfg;
}

const origFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = origFetch;
});

describe("applyRemoteActive (AiConfig → ActiveModel bridge)", () => {
  it("mirrors a remote active selection into ActiveModel with a buildable provider", async () => {
    const cfg = await bootConfig();
    await cfg.upsertConnection(
      { id: "c1", type: "openai", name: "OpenAI", starredModelIds: [] },
      "sk-1",
    );
    await cfg.setActive("c1", "gpt-4o");

    const activeModel = new ActiveModel();
    await applyRemoteActive(cfg, activeModel);

    const v = activeModel.get();
    expect(v?.kind).toBe("remote");
    expect(v?.providerId).toBe("c1");
    expect(v?.modelId).toBe("gpt-4o");
    // The pre-resolved provider is usable by the agent runtime.
    expect(typeof v?.createProvider().languageModel).toBe("function");
  });

  it("ignores a local active selection (owned by the local-models bridge)", async () => {
    const cfg = await bootConfig();
    await cfg.setActive("local", "smollm2");
    const activeModel = new ActiveModel();
    await applyRemoteActive(cfg, activeModel);
    expect(activeModel.get()).toBeNull();
  });

  it("no-ops when there is no active selection", async () => {
    const cfg = await bootConfig();
    const activeModel = new ActiveModel();
    await applyRemoteActive(cfg, activeModel);
    expect(activeModel.get()).toBeNull();
  });
});
