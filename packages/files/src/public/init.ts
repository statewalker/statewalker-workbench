import { newRegistry } from "@statewalker/shared-registry";
import { getWorkspace } from "@statewalker/workspace";
import { FilesManager } from "../internal/files.manager.js";

/**
 * Logic-fragment init for `files`. Constructs the `FilesManager`
 * which registers `files:*` command handlers against the workspace's
 * primary `FilesApi`. Per ADR 0002 (logic-only): no React imports.
 *
 * The built-in agent file tools are installed by the agent-runtime
 * builder itself, so this fragment no longer contributes to
 * `agent:tools` and carries no ordering constraint against it.
 */
export default function initFiles(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);

  const [register, cleanup] = newRegistry();
  const manager = new FilesManager({ workspace });
  register(() => manager.close());

  return cleanup;
}
