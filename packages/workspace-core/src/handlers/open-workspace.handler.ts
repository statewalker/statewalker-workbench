import { getIntents, runPickDirectory, runPreferenceGet } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import {
  getWorkspace,
  getWorkspaceConfig,
  handleOpenWorkspace,
  setWorkspace,
} from "@statewalker/workspace-api";
import { buildWorkspace } from "../impl/build-workspace.ts";
import type { Workspace } from "../impl/workspace.impl.ts";

/**
 * Key under which we remember a handle-identifier for the last-opened
 * workspace. Today the serialised value is whatever `platform.browser` chooses
 * to store; `workspace.core` treats it as opaque — if a preference handler
 * is registered AND it returns a remembered handle, we fire `pick-directory`
 * in resume mode; otherwise we prompt.
 */
export const WORKSPACE_LAST_HANDLE_PREFERENCE_KEY = "workspace:last-handle";

/**
 * Register the `workspace:open` handler. Platform-neutral — directory
 * picking is delegated to `platform.api`'s `runPickDirectory` intent, and
 * preference lookup to `runPreferenceGet`.
 */
export function registerOpenWorkspaceHandler(ctx: Record<string, unknown>): () => void {
  const intents = getIntents(ctx);
  return handleOpenWorkspace(intents, (intent) => {
    void performOpen(ctx, intents, intent.payload.force ?? false)
      .then((workspace) => {
        intent.resolve({ workspace });
      })
      .catch((error) => {
        intent.reject(error);
      });
    return true;
  });
}

async function performOpen(
  ctx: Record<string, unknown>,
  intents: Intents,
  force: boolean,
): Promise<Workspace> {
  const existing = getWorkspace(ctx, true) as Workspace | undefined;

  if (existing && !force) return existing;

  if (existing && force) {
    // Delegate to the change flow so workspace identity is preserved.
    const { files, label } = await runPickDirectory(intents, {
      title: "Select workspace folder",
    });
    await existing.close();
    existing.setFileSystem(files, label);
    await existing.open();
    return existing;
  }

  // No workspace yet. Honor remembered handle if any preference handler replies.
  await tryReadRememberedHandle(intents);

  const { files, label } = await runPickDirectory(intents, {
    title: "Select workspace folder",
  });
  const config = getWorkspaceConfig(ctx);
  const workspace = buildWorkspace(ctx, files, label, config);
  await workspace.open();
  setWorkspace(ctx, workspace);
  return workspace;
}

async function tryReadRememberedHandle(intents: Intents): Promise<unknown | undefined> {
  try {
    const result = await runPreferenceGet(intents, {
      key: WORKSPACE_LAST_HANDLE_PREFERENCE_KEY,
    });
    return result.value;
  } catch {
    return undefined;
  }
}
