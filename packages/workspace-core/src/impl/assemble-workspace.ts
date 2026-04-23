import type { WorkspaceConfig } from "@statewalker/workspace-api";
import {
  getWorkspace,
  setFilesApi,
  setSecretsApi,
  setSystemFilesApi,
  setWorkspace,
} from "@statewalker/workspace-api";
import type { FilesApi } from "@statewalker/webrun-files";
import { buildWorkspaceViews } from "./composite-setup.ts";
import { SecretsFilesImpl } from "./secrets-files.impl.ts";
import { WorkspaceImpl } from "./workspace.impl.ts";

/**
 * Wrap a freshly-picked root `FilesApi` into the `Workspace` the rest of the
 * app consumes: split the main/system views, build the `SecretsApi`, and
 * publish all four adapters atomically.
 *
 * If a workspace is already live in `ctx`, swap its fields in-place and fire
 * one `notify()` so existing `onUpdate` subscribers see a single update.
 * Otherwise create a new `WorkspaceImpl` and publish it via `setWorkspace`.
 */
export function assembleWorkspace(
  ctx: Record<string, unknown>,
  root: FilesApi,
  label: string,
  config: WorkspaceConfig,
): WorkspaceImpl {
  const { main, system } = buildWorkspaceViews(root, config.systemDir);
  const secrets = new SecretsFilesImpl({
    files: system,
    secretsDir: config.secretsDir,
  });

  const existing = getWorkspace(ctx, true) as WorkspaceImpl | undefined;
  let workspace: WorkspaceImpl;
  if (existing) {
    existing.replace({ files: main, systemFiles: system, secrets, label });
    workspace = existing;
  } else {
    workspace = new WorkspaceImpl({
      files: main,
      systemFiles: system,
      secrets,
      label,
    });
    setWorkspace(ctx, workspace);
  }

  setFilesApi(ctx, main);
  setSystemFilesApi(ctx, system);
  setSecretsApi(ctx, secrets);
  return workspace;
}
