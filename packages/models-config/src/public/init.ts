import { composerActionsSlot } from "@repo/chat-mini.chat";
import { ActiveModel } from "@statewalker/ai-agent-runtime";
import { AiConfig } from "@statewalker/ai-config";
import {
  type LocalModelRef,
  Providers,
  type ProvidersConfig,
  SelectActiveModelCommand,
} from "@statewalker/ai-providers";
import { settingsTabSlot } from "@statewalker/settings.core";
import { Commands } from "@statewalker/shared-commands";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace.core";
import { applyRemoteActive } from "../internal/remote-active-bridge.js";
import {
  COMPOSER_PICKER_VIEW_KEY,
  MODELS_CONFIG_LOCAL_TAB_ID,
  MODELS_CONFIG_LOCAL_TAB_VIEW_KEY,
} from "./constants.js";
import { LocalModels } from "./local-models.js";

/**
 * Logic-fragment init for `models-config`. Owns the **local-model**
 * lifecycle only — the remote-connections panel now lives in
 * `@statewalker/ai-config(.view.react)`.
 *
 * Boot order: register AFTER `initAgentRuntime` and `initProviders`
 * (requires both `ActiveModel` and `Providers` adapters).
 *
 * `LocalModels` is registered as a lazy factory because
 * `workspace.files` throws while no FileSystem is installed. The
 * factory only fires when something first calls
 * `requireAdapter(LocalModels)` — at that point the workspace is
 * already open and `workspace.files` is safe to read.
 */
export default function initModelsConfig(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  const commands = workspace.requireAdapter(Commands);
  const slots = workspace.requireAdapter(Slots);
  const providers = workspace.requireAdapter(Providers);
  const activeModel = workspace.requireAdapter(ActiveModel);
  const aiConfig = workspace.requireAdapter(AiConfig);

  // Lazy factory — only constructs once the workspace is open and
  // a consumer reaches for the adapter. Avoids touching
  // `workspace.files` at boot time.
  workspace.setAdapter(LocalModels, (ws) => new LocalModels({ files: ws.files }));

  const [register, cleanup] = newRegistry();

  // Slot: composer session-model picker.
  register(
    slots.provide(composerActionsSlot, {
      id: "models-config:picker",
      viewKey: COMPOSER_PICKER_VIEW_KEY,
      position: "leading",
      order: 10,
    }),
  );

  // Slot: the Local Models settings tab.
  register(
    slots.provide(settingsTabSlot, {
      id: MODELS_CONFIG_LOCAL_TAB_ID,
      title: "Local Models",
      viewKey: MODELS_CONFIG_LOCAL_TAB_VIEW_KEY,
      order: 30,
    }),
  );

  // Command: select-active-model for the local case. The
  // `ai-providers` listener already claims this command but skips
  // `providerId === "local"`; here we observe-only and react when
  // the local case applies. Observers don't claim, so the
  // ai-providers fallback path still runs for remote selections.
  register(
    commands.listen(SelectActiveModelCommand, (cmd) => {
      if (cmd.payload.providerId !== "local") return;
      void applyLocalSelection(workspace, providers, activeModel, cmd.payload.modelId);
      // Observe-only: ai-providers' listener resolves the command.
    }),
  );

  // Reactive bridge: when Providers.config.active.providerId becomes
  // `"local"` (e.g. on load), set ActiveModel for the local case.
  register(
    providers.onUpdate(() => {
      const active = providers.config.active;
      if (active.providerId !== "local" || !active.modelId) return;
      // Idempotent: only rewrite if it doesn't already match.
      const current = activeModel.get();
      if (
        current?.kind === "local" &&
        current.providerId === "local" &&
        current.modelId === active.modelId
      ) {
        return;
      }
      void applyLocalSelection(workspace, providers, activeModel, active.modelId);
    }),
  );

  // Reactive bridge: project `AiConfig`'s active remote selection into
  // `ActiveModel` (the chat runtime's build pointer). Fires on every
  // `AiConfig` update and on workspace load (persisted selection).
  register(aiConfig.onUpdate(() => void applyRemoteActive(aiConfig, activeModel)));
  register(workspace.onLoad(() => void applyRemoteActive(aiConfig, activeModel)));

  return cleanup;
}

async function applyLocalSelection(
  workspace: ReturnType<typeof getWorkspace>,
  providers: Providers,
  activeModel: ActiveModel,
  modelKey: string | undefined,
): Promise<void> {
  if (!modelKey) {
    activeModel.clear();
    return;
  }
  // Resolve LocalModels lazily — calling requireAdapter here triggers
  // the factory only when actually needed (i.e. the user picked a
  // local model), so the tjs engine isn't loaded for users who only
  // use remote connections.
  const localModels = workspace.requireAdapter(LocalModels);

  // Write ActiveModel with kind: "local" pointing at the in-memory
  // ModelStateStore. Lazy activation happens on first message via
  // ModelManager.activate (kicked off below).
  activeModel.set({
    kind: "local",
    providerId: "local",
    modelId: modelKey,
    createProvider: () => localModels.buildProvider(modelKey),
  });

  // Persist lastActivatedKey if it changed.
  const current = providers.config;
  if (current.local.lastActivatedKey !== modelKey) {
    const next: ProvidersConfig = {
      ...current,
      local: { ...current.local, lastActivatedKey: modelKey },
    };
    try {
      await providers.saveProviders(next);
    } catch {
      /* best-effort */
    }
  }

  // Kick off in-memory activation in the background. Failures surface
  // through ModelStateStore's status and propagate to the
  // AgentRuntimeAdapter on the runtime's next generate call.
  void consumeActivation(localModels, modelKey);
}

async function consumeActivation(localModels: LocalModels, key: string): Promise<void> {
  try {
    for await (const _progress of localModels.manager.activate(key)) {
      // Drained — progress observability happens through
      // ModelStateStore.onUpdate which the renderer-side bridge
      // mirrors into `/ui/downloads/{key}`.
    }
  } catch (err) {
    console.error(`[models-config] local activation failed for ${key}:`, err);
  }
}

/** Re-export so consumers can also persist downloaded entries from
 * action handlers in the renderer. */
export type { LocalModelRef };
