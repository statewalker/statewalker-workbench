import { Slots } from "@statewalker/shared-slots";
import { writeText } from "@statewalker/webrun-files";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { Workspace } from "@statewalker/workspace.core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { remoteProvidersSlot } from "../public/extension-points.js";
import { Providers } from "../public/providers.adapter.js";
import { emptyProvidersConfig, type ProvidersConfig } from "../public/providers-store.js";
import { ProvidersManager } from "./providers.manager.js";

async function writeProvidersJson(files: MemFilesApi, config: ProvidersConfig): Promise<void> {
  await writeText(files, "/.settings/providers.json", JSON.stringify(config, null, 2));
}

function makeWorkspace(files: MemFilesApi): Workspace {
  const ws = new Workspace();
  ws.setAdapter(Providers);
  ws.setFileSystem(files, "test");
  return ws;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ProvidersManager", () => {
  it("contributes one descriptor per Connection", async () => {
    const files = new MemFilesApi();
    await writeProvidersJson(files, {
      ...emptyProvidersConfig,
      connections: [
        {
          id: "openai",
          type: "openai",
          name: "OpenAI",
          apiKey: "sk-openai",
          discoveredModels: [],
          starredModelIds: [],
        },
        {
          id: "anthropic",
          type: "anthropic",
          name: "Anthropic",
          url: "https://anthropic-proxy.example.com",
          apiKey: "sk-anthropic",
          discoveredModels: [],
          starredModelIds: [],
        },
      ],
    });
    const ws = makeWorkspace(files);
    const slots = ws.requireAdapter(Slots);

    const manager = new ProvidersManager({ workspace: ws });
    await ws.open();
    await vi.runAllTimersAsync();

    const descriptors = slots.getSnapshot(remoteProvidersSlot);
    expect(descriptors.map((d) => d.id).sort()).toEqual(["anthropic", "openai"]);
    expect(descriptors.find((d) => d.id === "openai")?.kind).toBe("canonical");

    await manager.close();
  });

  it("produces two distinct descriptors for two Connections of the same canonical type", async () => {
    const files = new MemFilesApi();
    await writeProvidersJson(files, {
      ...emptyProvidersConfig,
      connections: [
        {
          id: "openai-work",
          type: "openai",
          name: "OpenAI (work)",
          apiKey: "sk-work",
          discoveredModels: [],
          starredModelIds: [],
        },
        {
          id: "openai-personal",
          type: "openai",
          name: "OpenAI (personal)",
          apiKey: "sk-personal",
          discoveredModels: [],
          starredModelIds: [],
        },
      ],
    });
    const ws = makeWorkspace(files);
    const slots = ws.requireAdapter(Slots);

    const manager = new ProvidersManager({ workspace: ws });
    await ws.open();
    await vi.runAllTimersAsync();

    const descriptors = slots.getSnapshot(remoteProvidersSlot);
    expect(descriptors).toHaveLength(2);
    const ids = descriptors.map((d) => d.id).sort();
    expect(ids).toEqual(["openai-personal", "openai-work"]);
    expect(descriptors.find((d) => d.id === "openai-work")?.label).toBe("OpenAI (work)");
    expect(descriptors.find((d) => d.id === "openai-personal")?.label).toBe("OpenAI (personal)");

    await manager.close();
  });

  it("re-entrant: ≥2 onLoad/onUnload cycles produce fresh slot contributions", async () => {
    const files = new MemFilesApi();
    await writeProvidersJson(files, {
      ...emptyProvidersConfig,
      connections: [
        {
          id: "openai",
          type: "openai",
          name: "OpenAI",
          apiKey: "sk-openai",
          discoveredModels: [],
          starredModelIds: [],
        },
      ],
    });
    const ws = makeWorkspace(files);
    const slots = ws.requireAdapter(Slots);

    const manager = new ProvidersManager({ workspace: ws });

    await ws.open();
    await vi.runAllTimersAsync();
    expect(slots.getSnapshot(remoteProvidersSlot).length).toBe(1);

    await ws.close();
    expect(slots.getSnapshot(remoteProvidersSlot).length).toBe(0);

    await writeProvidersJson(files, {
      ...emptyProvidersConfig,
      connections: [
        {
          id: "openai",
          type: "openai",
          name: "OpenAI",
          apiKey: "sk-openai",
          discoveredModels: [],
          starredModelIds: [],
        },
        {
          id: "anthropic",
          type: "anthropic",
          name: "Anthropic",
          url: "https://anthropic-proxy.example.com",
          apiKey: "sk-anthropic",
          discoveredModels: [],
          starredModelIds: [],
        },
      ],
    });
    await ws.open();
    await vi.runAllTimersAsync();
    expect(slots.getSnapshot(remoteProvidersSlot).length).toBe(2);

    await manager.close();
  });

  it("saveProviders persists config and re-derives the remote slot", async () => {
    const files = new MemFilesApi();
    await writeProvidersJson(files, emptyProvidersConfig);
    const ws = makeWorkspace(files);
    const providers = ws.requireAdapter(Providers);
    const slots = ws.requireAdapter(Slots);

    const manager = new ProvidersManager({ workspace: ws });
    await ws.open();
    await vi.runAllTimersAsync();
    expect(slots.getSnapshot(remoteProvidersSlot).length).toBe(0);

    await providers.saveProviders({
      ...emptyProvidersConfig,
      connections: [
        {
          id: "openai",
          type: "openai",
          name: "OpenAI",
          apiKey: "sk-openai",
          discoveredModels: [],
          starredModelIds: [],
        },
      ],
      active: { providerId: "openai", modelId: "gpt-4o" },
    });
    await vi.runAllTimersAsync();

    expect(providers.config.active).toEqual({ providerId: "openai", modelId: "gpt-4o" });
    expect(slots.getSnapshot(remoteProvidersSlot).map((d) => d.id)).toEqual(["openai"]);

    await manager.close();
  });
});
