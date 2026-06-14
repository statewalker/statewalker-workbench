import type { ActiveModel } from "@statewalker/ai-agent-runtime";
import type { AiConfig } from "@statewalker/ai-config";

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
