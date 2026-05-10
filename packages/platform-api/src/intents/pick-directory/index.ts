import { defineCommand } from "@statewalker/shared-commands";
import type { FilesApi } from "@statewalker/webrun-files";

export const PICK_DIRECTORY_INTENT_KEY = "platform:pick-directory";

export interface PickDirectoryPayload {
  title?: string;
}

export interface PickDirectoryResult {
  files: FilesApi;
  label: string;
}

export const PickDirectoryCommand = defineCommand<PickDirectoryPayload,
  PickDirectoryResult>(PICK_DIRECTORY_INTENT_KEY, () => {});
