import { newRegistry } from "@statewalker/shared-registry";
import { getWorkspace } from "@statewalker/workspace.core";
import { ProvidersManager } from "../internal/providers.manager.js";
import { Providers } from "./providers.adapter.js";

/**
 * Logic-fragment init for `providers`. Constructs the `Providers`
 * adapter (data) and the `ProvidersManager` (re-entrant orchestrator
 * that reads/writes `providers.json` and contributes to
 * `providers:remote`). It is kept booted as the local-model
 * persistence store; the remote `ActiveModel` pointer is owned by the
 * AiConfig-driven projection in `models-config`.
 *
 * Per ADR 0002 (logic-only), no React imports.
 */
export default function initProviders(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);
  workspace.setAdapter(Providers);

  const [register, cleanup] = newRegistry();
  const manager = new ProvidersManager({ workspace });
  register(() => manager.close());

  return cleanup;
}
