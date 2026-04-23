import { registerChangeWorkspaceHandler } from "./handlers/change-workspace.handler.ts";
import { registerOpenWorkspaceHandler } from "./handlers/open-workspace.handler.ts";

/**
 * Register the `workspace:open` / `workspace:change` handlers against the
 * shared `Intents` bus. Returns a cleanup that unregisters both.
 *
 * The function itself is platform-neutral — it's the intent handlers that
 * delegate browser work to `platform.web` via the `platform:*` intents.
 * Under Node tests, stub `platform:pick-directory` (and optionally
 * `platform:preference-get`) before calling this.
 */
export default function initWorkspaceCore(
  ctx: Record<string, unknown>,
): () => void {
  const cleanups = [
    registerOpenWorkspaceHandler(ctx),
    registerChangeWorkspaceHandler(ctx),
  ];
  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) {
      cleanups[i]?.();
    }
  };
}
