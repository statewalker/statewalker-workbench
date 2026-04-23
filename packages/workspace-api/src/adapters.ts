import { newAdapter } from "@statewalker/shared-adapters";
import type { FilesApi } from "@statewalker/webrun-files";
import type { SecretsApi, Workspace } from "./types.ts";

export const [getWorkspace, setWorkspace, removeWorkspace] =
  newAdapter<Workspace>("workspace:workspace");

export const [getFilesApi, setFilesApi, removeFilesApi] =
  newAdapter<FilesApi>("workspace:files");

export const [getSystemFilesApi, setSystemFilesApi, removeSystemFilesApi] =
  newAdapter<FilesApi>("workspace:system-files");

export const [getSecretsApi, setSecretsApi, removeSecretsApi] =
  newAdapter<SecretsApi>("workspace:secrets");
