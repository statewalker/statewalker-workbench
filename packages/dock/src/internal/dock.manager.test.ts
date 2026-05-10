import { Commands } from "@statewalker/shared-commands";
import { SpecStore } from "@statewalker/spec-store";
import initSpecStore from "@statewalker/spec-store/fragment";
import { getWorkspace } from "@statewalker/workspace";
import type { DockviewApi, IDockviewPanel } from "dockview-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DockHost } from "../public/dock-host.js";
import initDock from "../public/init.js";
import { ClosePanelCommand, FocusPanelCommand, ShowDockPanelCommand } from "../public/intents.js";

interface FakePanel {
  id: string;
  params: Record<string, unknown>;
  focus: ReturnType<typeof vi.fn>;
}

function makeFakeApi(): {
  api: DockviewApi;
  panels: Map<string, FakePanel>;
} {
  const panels = new Map<string, FakePanel>();
  const fake = {
    addPanel: vi.fn((opts: { id: string; params?: Record<string, unknown> }) => {
      const panel: FakePanel = {
        id: opts.id,
        params: opts.params ?? {},
        focus: vi.fn(),
      };
      panels.set(opts.id, panel);
      return panel as unknown as IDockviewPanel;
    }),
    removePanel: vi.fn((p: { id: string }) => {
      panels.delete(p.id);
    }),
    getPanel: vi.fn((id: string) => panels.get(id) as unknown as IDockviewPanel | undefined),
    get panels() {
      return Array.from(panels.values()) as unknown as IDockviewPanel[];
    },
    toJSON: vi.fn(() => ({})),
    fromJSON: vi.fn(),
    onDidLayoutChange: vi.fn(() => ({ dispose: () => {} })),
    onDidActivePanelChange: vi.fn(() => ({ dispose: () => {} })),
    activePanel: undefined,
  };
  return { api: fake as unknown as DockviewApi, panels };
}

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("dock:* intent handlers (DockManager)", () => {
  it("runShowDockPanel queues and resolves once the api attaches", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const specId = store.create({ catalogId: "c", spec: { hello: "world" } });
      const intent = intents.call(ShowDockPanelCommand, { panelId: "p1", specId });
      expect(dockHost._pendingCount()).toBe(1);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);
      await intent.promise;

      expect(panels.has("p1")).toBe(true);
      expect(panels.get("p1")?.params.specId).toBe(specId);
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runShowDockPanel after attach opens immediately", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);

      const specId = store.create({ catalogId: "c", spec: 1 });
      await intents.call(ShowDockPanelCommand, { panelId: "p1", specId }).promise;
      expect(panels.has("p1")).toBe(true);
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runClosePanel evicts a transient spec on close", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);
      const specId = store.create({ catalogId: "c", spec: 1 });
      await intents.call(ShowDockPanelCommand, { panelId: "p1", specId }).promise;
      expect(panels.has("p1")).toBe(true);
      expect(store.get(specId)).not.toBeNull();

      await intents.call(ClosePanelCommand, { panelId: "p1" }).promise;
      expect(panels.has("p1")).toBe(false);
      expect(store.get(specId)).toBeNull(); // transient → evicted
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runClosePanel keeps a persistent spec", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);
      const specId = store.create({
        catalogId: "c",
        spec: 1,
        meta: { persistent: true },
      });
      await intents.call(ShowDockPanelCommand, { panelId: "p1", specId }).promise;
      await intents.call(ClosePanelCommand, { panelId: "p1" }).promise;

      expect(panels.has("p1")).toBe(false);
      expect(store.get(specId)).not.toBeNull();
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runFocusPanel focuses an existing panel", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);
      const specId = store.create({ catalogId: "c", spec: 1 });
      await intents.call(ShowDockPanelCommand, { panelId: "p1", specId }).promise;
      panels.get("p1")?.focus.mockClear();

      await intents.call(FocusPanelCommand, { panelId: "p1" }).promise;
      expect(panels.get("p1")?.focus).toHaveBeenCalledTimes(1);
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runClosePanel keeps the spec while another panel still references it", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const store = ws.requireAdapter(SpecStore);
      const dockHost = ws.requireAdapter(DockHost);

      const { api, panels } = makeFakeApi();
      dockHost.setApi(api);
      const specId = store.create({ catalogId: "c", spec: 1 });
      // Two panels share the same spec.
      await intents.call(ShowDockPanelCommand, { panelId: "p-a", specId }).promise;
      await intents.call(ShowDockPanelCommand, { panelId: "p-b", specId }).promise;
      expect(panels.size).toBe(2);

      // Closing one panel keeps the spec alive.
      await intents.call(ClosePanelCommand, { panelId: "p-a" }).promise;
      expect(panels.has("p-a")).toBe(false);
      expect(store.get(specId)).not.toBeNull();

      // Closing the second (last) panel evicts.
      await intents.call(ClosePanelCommand, { panelId: "p-b" }).promise;
      expect(panels.has("p-b")).toBe(false);
      expect(store.get(specId)).toBeNull();
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });

  it("runFocusPanel on missing panel resolves without error", async () => {
    const ctx: Record<string, unknown> = {};
    const cleanupSpec = await initSpecStore(ctx);
    const cleanupDock = await initDock(ctx);
    try {
      const ws = getWorkspace(ctx);
      const intents = ws.requireAdapter(Commands);
      const dockHost = ws.requireAdapter(DockHost);
      const { api } = makeFakeApi();
      dockHost.setApi(api);
      await expect(intents.call(FocusPanelCommand, { panelId: "missing" }).promise).resolves.toBeUndefined();
    } finally {
      await cleanupDock();
      await cleanupSpec();
    }
  });
});
