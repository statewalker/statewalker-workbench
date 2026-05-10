import { defineCommand } from "@statewalker/shared-commands";

export const COPY_TO_CLIPBOARD_INTENT_KEY = "platform:copy-to-clipboard";

export interface CopyToClipboardPayload {
  text: string;
}

export const CopyToClipboardCommand = defineCommand<CopyToClipboardPayload, void>(COPY_TO_CLIPBOARD_INTENT_KEY, () => {});
