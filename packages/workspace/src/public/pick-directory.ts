import { newIntent } from "@statewalker/shared-intents";
import type { FilesApi } from "@statewalker/webrun-files";

/**
 * Local re-declaration of the `platform:pick-directory` intent contract.
 *
 * The workspace-api fragment dispatches this intent from `workspace:change`
 * (interactive path) without wanting to depend on `@statewalker/platform-api`
 * — that direction would close the cycle `platform-api → workspace-api →
 * platform-api`. The intent is keyed by string, so re-declaring `[run, handle]`
 * here resolves to the same handlers any platform-binding fragment registers.
 */
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
