import type { FilesApi } from "@statewalker/webrun-files";
import { Secrets } from "../types/secrets.js";
import { Settings } from "../types/settings.js";
import { SystemFiles } from "../types/system-files.js";
import { Workspace } from "../types/workspace.js";
import { FilesBackedSecrets } from "./secrets-files.impl.js";
import { FilesBackedSettings } from "./settings-files.impl.js";
import { FilesBackedSystemFiles } from "./system-files.impl.js";

export function initWorkspace({
  workspace = new Workspace(),
  filesApi,
  systemDir = ".settings",
  label = "Workspace",
}: {
  workspace: Workspace;
  filesApi: FilesApi;
  systemDir?: string;
  label?: string;
}): Workspace {
  return workspace
    .setFileSystem(filesApi, label ?? "Workspace")
    .setAdapter(SystemFiles, (ws) => new FilesBackedSystemFiles(ws, systemDir))
    .setAdapter(Secrets, (ws) => new FilesBackedSecrets(ws, "secrets"))
    .setAdapter(Settings, (ws) => new FilesBackedSettings(ws, "settings"));
}
