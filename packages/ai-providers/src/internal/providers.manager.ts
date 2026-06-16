import { Commands } from "@statewalker/shared-commands";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import type { Workspace } from "@statewalker/workspace.core";
import { SelectActiveModelCommand, type SelectActiveModelPayload } from "../public/commands.js";
import { remoteProvidersSlot } from "../public/extension-points.js";
import { Providers } from "../public/providers.adapter.js";
import {
  type Connection,
  emptyProvidersConfig,
  isConnected,
  loadProvidersConfig,
  type ProvidersConfig,
  saveProvidersConfig,
} from "../public/providers-store.js";
import type { ProviderDescriptor } from "../public/types.js";
import { buildAnthropicDescriptor } from "./builtins/anthropic.js";
import { buildCustomDescriptor } from "./builtins/custom.js";
import { buildGoogleDescriptor } from "./builtins/google.js";
import { buildOpenAIDescriptor } from "./builtins/openai.js";

export interface ProvidersManagerOptions {
  workspace: Workspace;
  systemFolder?: string;
}

/**
 * Re-entrant orchestrator for the providers fragment. On each
 * `workspace.onLoad`:
 *   1. Reads `providers.json` from `<systemFolder>/providers.json`
 *      (with automatic v1→v2→v3→v4 migration).
 *   2. For each Connection, builds a `ProviderDescriptor` and
 *      contributes it to the `providers:remote` slot.
 *
 * On `onUnload`: disposes slot contributions and resets the config.
 *
 * The remote `ActiveModel` pointer and the runtime empty-state are owned by
 * the AiConfig-driven projection in `models-config` (see
 * `remote-active-bridge.ts`). This manager persists `providers.json` (including
 * the `local` section the local-models bridge relies on) but no longer writes
 * `ActiveModel` or `AgentRuntimeAdapter`.
 */
export class ProvidersManager {
  private readonly workspace: Workspace;
  private readonly commands: Commands;
  private readonly slots: Slots;
  private readonly providers: Providers;
  private readonly systemFolder: string;
  private readonly _cleanup: () => Promise<void>;

  private _slotCleanup: Array<() => void> = [];
  private _isLoaded = false;

  constructor(opts: ProvidersManagerOptions) {
    this.workspace = opts.workspace;
    this.systemFolder = opts.systemFolder ?? ".settings";
    this.commands = opts.workspace.requireAdapter(Commands);
    this.slots = opts.workspace.requireAdapter(Slots);
    this.providers = opts.workspace.requireAdapter(Providers);

    this.providers._setSystemFolder(this.systemFolder);
    this.providers._attach({
      saveProviders: (next) => this._saveProviders(next),
      reload: () => this._reload(),
    });

    const [register, cleanup] = newRegistry();
    this._cleanup = cleanup;

    register(
      this.commands.listen(SelectActiveModelCommand, (cmd) => {
        void this._persistActiveSelection(cmd.payload)
          .then(() => cmd.resolve())
          .catch((err) => cmd.reject(err));
        return true;
      }),
    );

    register(opts.workspace.onLoad(() => void this._onLoad()));
    register(opts.workspace.onUnload(() => this._onUnload()));

    if (opts.workspace.isOpened) void this._onLoad();
  }

  async close(): Promise<void> {
    if (this._isLoaded) this._onUnload();
    await this._cleanup();
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  private async _onLoad(): Promise<void> {
    if (this._isLoaded) return;
    this._isLoaded = true;
    try {
      const config = await loadProvidersConfig(this.workspace.files, this.systemFolder);
      this._applyConfig(config);
    } catch (error) {
      console.error("[providers] failed to load providers.json:", error);
    }
  }

  private _onUnload(): void {
    if (!this._isLoaded) return;
    this._isLoaded = false;
    for (const dispose of this._slotCleanup) {
      try {
        dispose();
      } catch (err) {
        console.error("[providers] slot cleanup threw:", err);
      }
    }
    this._slotCleanup = [];
    this.providers._setConfig(emptyProvidersConfig);
  }

  // ── Imperative API (called by Providers.saveProviders / reload) ──

  private async _saveProviders(next: ProvidersConfig): Promise<void> {
    if (!this._isLoaded) return;
    await saveProvidersConfig(this.workspace.files, this.systemFolder, next);
    this._applyConfig(next);
  }

  private async _reload(): Promise<void> {
    if (!this._isLoaded) return;
    const config = await loadProvidersConfig(this.workspace.files, this.systemFolder);
    this._applyConfig(config);
  }

  // ── Slot + providers.json writers ─────────────────────────────

  private _applyConfig(config: ProvidersConfig): void {
    for (const dispose of this._slotCleanup) dispose();
    this._slotCleanup = [];

    const descriptors = buildDescriptors(config);
    for (const desc of descriptors) {
      this._slotCleanup.push(this.slots.provide(remoteProvidersSlot, desc));
    }

    this.providers._setConfig(config);
  }

  /**
   * Persist the active selection into `providers.json`. The `local` case is
   * relied upon by the `models-config` local-models bridge, which reads back
   * `providers.config.active.providerId === "local"` on load. Remote selections
   * are driven through `AiConfig` and projected to `ActiveModel` elsewhere; this
   * persistence only keeps `providers.json` in sync.
   */
  private async _persistActiveSelection(selection: SelectActiveModelPayload): Promise<void> {
    if (!this._isLoaded) return;
    const next: ProvidersConfig = {
      ...this.providers.config,
      active: { providerId: selection.providerId, modelId: selection.modelId },
    };
    await this._saveProviders(next);
  }
}

function buildDescriptor(c: Connection): ProviderDescriptor {
  switch (c.type) {
    case "openai":
      return buildOpenAIDescriptor(c);
    case "anthropic":
      return buildAnthropicDescriptor(c);
    case "google":
      return buildGoogleDescriptor(c);
    case "openai-compatible":
      return buildCustomDescriptor(c);
  }
}

function buildDescriptors(config: ProvidersConfig): ProviderDescriptor[] {
  // Dormant shells (cleared apiKey, no discoveredModels) produce no
  // `providers:remote` contribution. Re-Connect reintroduces them.
  return config.connections.filter(isConnected).map(buildDescriptor);
}
