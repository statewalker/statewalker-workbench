import type { ActiveModel, AgentRuntimeAdapter } from "@statewalker/ai-agent-runtime.core";
import type { AiConfig } from "@statewalker/ai-config.core";

/**
 * Project `AiConfig`'s active **remote** selection into `ActiveModel` (the chat
 * runtime's build pointer). Pre-resolves the provider because
 * `ActiveModelValue.createProvider` is synchronous while `AiConfig.getProvider`
 * reads the key from `Secrets` (async). Local selections are owned by the
 * local-models bridge and ignored here. Idempotent and safe to call on every
 * `AiConfig` update and on workspace load.
 */
export async function applyRemoteActive(
  aiConfig: AiConfig,
  activeModel: ActiveModel,
): Promise<void> {
  const active = aiConfig.getActive();
  if (!active.connectionId || !active.modelId || active.connectionId === "local") return;
  const current = activeModel.get();
  if (
    current?.kind === "remote" &&
    current.providerId === active.connectionId &&
    current.modelId === active.modelId
  ) {
    return;
  }
  try {
    const provider = await aiConfig.getProvider(active.connectionId);
    // Re-read in case the active selection changed while awaiting.
    const latest = aiConfig.getActive();
    if (latest.connectionId !== active.connectionId || latest.modelId !== active.modelId) return;
    activeModel.set({
      kind: "remote",
      providerId: active.connectionId,
      modelId: active.modelId,
      createProvider: () => provider,
    });
  } catch {
    // Bad/missing key or unbuildable provider — leave ActiveModel untouched.
  }
}

/**
 * Single owner of the chat runtime's **empty-state** (`AgentRuntimeAdapter`
 * `no-providers` / `no-active-model`). Call after every `ActiveModel` projection
 * (remote via {@link applyRemoteActive}, local via the local-models bridge).
 *
 * When a model is active (remote or local), the `AgentRuntimeManager` owns the
 * published state (`ready` / `error`), so this is a no-op. When nothing is
 * active, it sets `no-providers` (no AiConfig connections) or `no-active-model`
 * (connections exist but none selected) so the chat UI shows its placeholder
 * instead of hanging on the default `loading` spinner. Previously owned by
 * `ai-providers`' `providers.manager`; moved here so a single fragment owns
 * both the remote and local projections.
 */
export function applyRuntimeEmptyState(
  aiConfig: AiConfig,
  activeModel: ActiveModel,
  adapter: AgentRuntimeAdapter,
): void {
  if (activeModel.get()) return;
  const hasConnections = aiConfig.listConnections().length > 0;
  adapter._setState({ status: hasConnections ? "no-active-model" : "no-providers" });
}
