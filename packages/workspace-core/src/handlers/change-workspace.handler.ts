import { getIntents, runPickDirectory } from "@statewalker/platform-api";
import { getWorkspace, handleChangeWorkspace, runOpenWorkspace } from "@statewalker/workspace-api";
import type { Workspace } from "../impl/workspace.impl.ts";

/**
 * Register the `workspace:change` handler. Orchestrates the three-step
 * rebind: `close()` → `setFileSystem()` → `open()` so workspace identity is
 * preserved. If no workspace exists yet, delegates to `workspace:open`.
 */
export function registerChangeWorkspaceHandler(ctx: Record<string, unknown>): () => void {
  const intents = getIntents(ctx);
  return handleChangeWorkspace(intents, (intent) => {
    void (async () => {
      const existing = getWorkspace(ctx, true) as Workspace | undefined;
      if (!existing) {
        const { workspace } = await runOpenWorkspace(intents, {});
        return workspace as Workspace;
      }
      const { files, label } = await runPickDirectory(intents, {
        title: "Change workspace folder",
      });
      await existing.close();
      existing.setFileSystem(files, label);
      await existing.open();
      return existing;
    })()
      .then((workspace) => {
        intent.resolve({ workspace });
      })
      .catch((error) => {
        intent.reject(error);
      });
    return true;
  });
}
