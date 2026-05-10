import type { Intents } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";
import { initWorkspace } from "../public/init-workspace.js";
import { handleChangeWorkspace } from "../public/intents.js";
import { runPickDirectory } from "../public/pick-directory.js";
import type { Workspace } from "../public/types/workspace.js";

/**
 * Register the `workspace:change` handler.
 *
 * Two activation paths share this handler:
 *   1. Non-interactive: `runChangeWorkspace(intents, { files, label? })` —
 *      the handler skips the dialog and rebinds the workspace to the
 *      supplied `FilesApi` directly. Used by tests, the integration
 *      harness, the `?fs=mem` shortcut, and any non-UI caller.
 *   2. Interactive: `runChangeWorkspace(intents, {})` — the handler fires
 *      `platform:pick-directory` and awaits the user's choice.
 *      Cancel/dismiss rejects the intent with `UserCancelledError`.
 *
 * Both paths preserve workspace identity by performing
 * `await close → setFileSystem → await open` in that order so adapters
 * bound to the previous `FilesApi` are torn down before the new one is
 * opened.
 */
export function registerChangeWorkspaceHandler({
  intents,
  workspace,
}: {
  intents: Intents;
  workspace: Workspace;
}): () => void {
  return handleChangeWorkspace(intents, (intent) => {
    void (async () => {
      let newFiles: FilesApi;
      let newLabel: string | undefined;
      if (intent.payload.files) {
        newFiles = intent.payload.files;
        newLabel = intent.payload.label;
      } else {
        const picked = await runPickDirectory(intents, {
          title: "Change workspace folder",
        }).promise;
        newFiles = picked.files;
        newLabel = picked.label;
      }
      await workspace.close();
      initWorkspace({ workspace, filesApi: newFiles, label: newLabel });
      await workspace.open();
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
