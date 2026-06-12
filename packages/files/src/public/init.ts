import { newRegistry } from "@statewalker/shared-registry";
import { getWorkspace, WorkspaceFilesManager } from "@statewalker/workspace";
import { FilesManager } from "../internal/files.manager.js";

/**
 * Logic-fragment init for `files`. Constructs:
 *   - `WorkspaceFilesManager` (from `@statewalker/workspace`) which
 *     registers the primitive `files:*` filesystem command handlers
 *     against the workspace's primary `FilesApi`, and
 *   - `FilesManager` which handles `files:visualize` (mime-renderer
 *     dispatch into a dock panel).
 *
 * Per ADR 0002 (logic-only): no React imports. The built-in agent file
 * tools are installed by the agent-runtime builder itself, so this
 * fragment no longer contributes to `agent:tools`.
 */
export default function initFiles(ctx: Record<string, unknown>): () => Promise<void> {
  const workspace = getWorkspace(ctx);

  const [register, cleanup] = newRegistry();
  const workspaceFiles = new WorkspaceFilesManager({ workspace });
  register(() => workspaceFiles.dispose());
  const manager = new FilesManager({ workspace });
  register(() => manager.close());

  return cleanup;
}
