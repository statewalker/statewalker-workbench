import { getIntents } from "@statewalker/platform-api";
import type { FilesApi } from "@statewalker/webrun-files";
import {
  getWorkspace,
  getWorkspaceConfig,
  handleChangeWorkspace,
  runOpenWorkspace,
  setWorkspace,
} from "@statewalker/workspace-api";
import { buildWorkspace } from "../impl/build-workspace.ts";
import type { Workspace } from "../impl/workspace.impl.ts";
import { openRequestFileSystemDialog } from "../views/request-file-system.view.ts";

/**
 * Register the `workspace:change` handler.
 *
 * Two activation paths share this handler:
 *   1. Non-interactive: `runChangeWorkspace(intents, { files, label? })` —
 *      the handler skips the dialog and rebinds the workspace to the
 *      supplied `FilesApi` directly. Used by tests, the integration
 *      harness, the `?fs=mem` shortcut, and any non-UI caller.
 *   2. Interactive: `runChangeWorkspace(intents, {})` — the handler opens
 *      the unified request-file-system dialog via `publishDialog` and
 *      awaits the user's choice. Cancel/dismiss rejects the intent with
 *      `UserCancelledError`.
 *
 * Both paths preserve workspace identity by performing
 * `await close → setFileSystem → await open` in that order so adapters
 * bound to the previous `FilesApi` are torn down before the new one is
 * opened.
 *
 * If no workspace exists yet, the handler delegates to `workspace:open` —
 * which creates and opens the workspace via the same dialog path.
 */
export function registerChangeWorkspaceHandler(ctx: Record<string, unknown>): () => void {
  const intents = getIntents(ctx);
  return handleChangeWorkspace(intents, (intent) => {
    void (async () => {
      const existing = getWorkspace(ctx, true) as Workspace | undefined;
      if (!existing) {
        // No workspace yet. If the caller supplied files, build directly so
        // the payload override takes effect on the cold-start path too. The
        // dialog branch (no payload) delegates to runOpenWorkspace so the
        // historical "create workspace" semantics live in one place.
        if (intent.payload.files !== undefined) {
          const config = getWorkspaceConfig(ctx);
          const workspace = buildWorkspace(
            ctx,
            intent.payload.files,
            intent.payload.label ?? "Workspace",
            config,
          );
          await workspace.open();
          setWorkspace(ctx, workspace);
          return workspace as Workspace;
        }
        const { workspace } = await runOpenWorkspace(intents, {});
        return workspace as Workspace;
      }
      const { files, label } = await resolveFiles(ctx, intent.payload.files, intent.payload.label);
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

async function resolveFiles(
  ctx: Record<string, unknown>,
  payloadFiles: FilesApi | undefined,
  payloadLabel: string | undefined,
): Promise<{ files: FilesApi; label: string }> {
  if (payloadFiles !== undefined) {
    return { files: payloadFiles, label: payloadLabel ?? "Workspace" };
  }
  return openRequestFileSystemDialog(ctx, { title: "Change workspace folder" });
}
