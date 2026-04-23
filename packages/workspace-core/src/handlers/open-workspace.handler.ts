import {
  getWorkspace,
  getWorkspaceConfig,
  handleOpenWorkspace,
} from "@statewalker/workspace-api";
import {
  getIntents,
  runPickDirectory,
  runPreferenceGet,
} from "@statewalker/platform.api";
import type { Intents } from "@statewalker/shared-intents";
import { assembleWorkspace } from "../impl/assemble-workspace.ts";
import type { WorkspaceImpl } from "../impl/workspace.impl.ts";

/**
 * Key under which we remember a handle-identifier for the last-opened
 * workspace. Today the serialised value is whatever `platform.web` chooses
 * to store; `workspace.core` treats it as opaque — if a preference handler
 * is registered AND it returns a remembered handle, we fire `pick-directory`
 * in resume mode; otherwise we prompt.
 */
export const WORKSPACE_LAST_HANDLE_PREFERENCE_KEY = "workspace:last-handle";

/**
 * Register the `workspace:open` handler. The handler is platform-neutral —
 * directory picking is delegated to `platform.api`'s `runPickDirectory`
 * intent, and preference lookup is delegated to `platform.api`'s
 * `runPreferenceGet`. Under Node tests you stub both.
 */
export function registerOpenWorkspaceHandler(
  ctx: Record<string, unknown>,
): () => void {
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
): Promise<WorkspaceImpl> {
  // If a workspace is already open and the caller didn't ask for a fresh
  // picker, short-circuit — the plan's §2.1 open flow says force=true is the
  // way to re-prompt.
  if (!force) {
    const existing = getWorkspace(ctx, true) as WorkspaceImpl | undefined;
    if (existing) return existing;
    // Best-effort: honor a remembered handle when one is persisted.
    // We don't interpret the value here — we just check whether the handler
    // is registered AND something non-empty came back. When running without
    // a preference handler, `runPreferenceGet` rejects as unhandled; we
    // swallow that and fall through to the picker.
    const remembered = await tryReadRememberedHandle(intents);
    if (remembered !== undefined) {
      // Present-day platform.web doesn't persist opaque handles (browsers
      // require a fresh user gesture), so for v1 we still prompt. Placeholder
      // kept so a future host that CAN restore handles has a hook.
    }
  }

  const { files, label } = await runPickDirectory(intents, {
    title: "Select workspace folder",
  });
  const config = getWorkspaceConfig(ctx);
  return assembleWorkspace(ctx, files, label, config);
}

async function tryReadRememberedHandle(
  intents: Intents,
): Promise<unknown | undefined> {
  try {
    const result = await runPreferenceGet(intents, {
      key: WORKSPACE_LAST_HANDLE_PREFERENCE_KEY,
    });
    return result.value;
  } catch {
    return undefined;
  }
}
