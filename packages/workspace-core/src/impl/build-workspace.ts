import type { FilesApi } from "@statewalker/webrun-files";
import {
  getWorkspaceConfig,
  Secrets,
  Settings,
  SystemFiles,
  type WorkspaceConfig,
} from "@statewalker/workspace-api";
import { FilesBackedSecrets } from "./secrets-files.impl.ts";
import { FilesBackedSettings } from "./settings-files.impl.ts";
import { FilesBackedSystemFiles } from "./system-files.impl.ts";
import { Workspace } from "./workspace.impl.ts";

/**
 * Construct a `Workspace`, register the default adapter implementations
 * (closing over config-derived paths), install the raw root file system, and
 * return the workspace in the **closed** state. Callers are responsible for
 * awaiting `open()` and publishing via `setWorkspace(ctx, …)`.
 *
 * `workspace.files` is the raw root the user picked; `SystemFiles.files` is
 * a re-rooted subtree view derived from it. Adapters are not instantiated
 * eagerly — the returned workspace has an empty instance cache.
 */
export function buildWorkspace(
  ctx: Record<string, unknown>,
  files: FilesApi,
  label: string,
  config?: WorkspaceConfig,
): Workspace {
  const resolved = config ?? getWorkspaceConfig(ctx);
  const workspace = new Workspace();
  workspace
    .setAdapter(SystemFiles, (ws) => new FilesBackedSystemFiles(ws, resolved.systemDir))
    .setAdapter(Secrets, (ws) => new FilesBackedSecrets(ws, resolved.secretsDir))
    .setAdapter(Settings, (ws) => new FilesBackedSettings(ws, resolved.settingsDir))
    .setFileSystem(files, label);
  return workspace;
}
