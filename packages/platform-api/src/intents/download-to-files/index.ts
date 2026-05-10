import { defineCommand } from "@statewalker/shared-commands";
import type { FilesApi } from "@statewalker/webrun-files";

export const DOWNLOAD_TO_FILES_INTENT_KEY = "platform:download-to-files";

export interface DownloadProgress {
  loaded: number;
  total?: number;
}

export interface DownloadToFilesPayload {
  url: string;
  files: FilesApi;
  path: string;
  resume?: boolean;
  onProgress?: (progress: DownloadProgress) => void;
  signal?: AbortSignal;
}

export interface DownloadToFilesResult {
  bytes: number;
}

export const DownloadToFilesCommand = defineCommand<DownloadToFilesPayload,
  DownloadToFilesResult>(DOWNLOAD_TO_FILES_INTENT_KEY, () => {});
