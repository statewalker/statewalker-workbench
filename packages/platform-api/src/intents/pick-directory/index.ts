import { newIntent } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";

export const PICK_DIRECTORY_INTENT_KEY = "platform:pick-directory";

export interface PickDirectoryPayload {
  title?: string;
}

export interface PickDirectoryResult {
  files: FilesApi;
  label: string;
}

export const [runPickDirectory, handlePickDirectory] = newIntent<
  PickDirectoryPayload,
  PickDirectoryResult
>(PICK_DIRECTORY_INTENT_KEY);
