import { getWorkspaceConfig, handleChangeWorkspace } from "@statewalker/workspace-api";
import { getIntents, runPickDirectory } from "@statewalker/platform.api";
import { assembleWorkspace } from "../impl/assemble-workspace.ts";

/**
 * Register the `workspace:change` handler. Re-runs the picker, assembles a
 * fresh workspace, and swaps the existing `Workspace` object in-place so
 * `onUpdate` subscribers see exactly one notification per change.
 */
export function registerChangeWorkspaceHandler(
  ctx: Record<string, unknown>,
): () => void {
  const intents = getIntents(ctx);
  return handleChangeWorkspace(intents, (intent) => {
    void (async () => {
      const { files, label } = await runPickDirectory(intents, {
        title: "Change workspace folder",
      });
      const config = getWorkspaceConfig(ctx);
      const workspace = assembleWorkspace(ctx, files, label, config);
      return workspace;
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
