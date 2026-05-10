import { defineCommand } from "@statewalker/shared-commands";

export const PICK_FILE_INTENT_KEY = "platform:pick-file";

export interface PickFilePayload {
  title?: string;
  accept?: string[];
  multiple?: boolean;
}

export interface PickFileResult {
  blobs: Blob[];
  names: string[];
}

export const PickFileCommand = defineCommand<PickFilePayload, PickFileResult>(PICK_FILE_INTENT_KEY, () => {});
