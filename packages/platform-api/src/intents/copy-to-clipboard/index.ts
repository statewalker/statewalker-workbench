import { newIntent } from "@statewalker/shared-intents";

export const COPY_TO_CLIPBOARD_INTENT_KEY = "platform:copy-to-clipboard";

export interface CopyToClipboardPayload {
  text: string;
}

export const [runCopyToClipboard, handleCopyToClipboard] = newIntent<CopyToClipboardPayload, void>(
  COPY_TO_CLIPBOARD_INTENT_KEY,
);
