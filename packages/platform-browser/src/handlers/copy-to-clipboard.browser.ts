import { handleCopyToClipboard } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";

/**
 * Browser default for `platform:copy-to-clipboard`. Uses
 * `navigator.clipboard.writeText`; the call requires a secure context and may
 * fail if the user has not granted clipboard permission — failures reject the
 * intent with the underlying error for the caller to surface.
 */
export function registerCopyToClipboardBrowser(intents: Intents): () => void {
  return handleCopyToClipboard(intents, (intent) => {
    void navigator.clipboard
      .writeText(intent.payload.text)
      .then(() => {
        intent.resolve(undefined);
      })
      .catch((error) => {
        intent.reject(error);
      });
    return true;
  });
}
