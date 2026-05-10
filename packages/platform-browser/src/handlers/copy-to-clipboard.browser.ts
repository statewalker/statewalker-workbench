import { CopyToClipboardCommand } from "@statewalker/platform-api";
import type { Commands } from "@statewalker/shared-commands";

/**
 * Browser default for `platform:copy-to-clipboard`. Uses
 * `navigator.clipboard.writeText`; the call requires a secure context and may
 * fail if the user has not granted clipboard permission — failures reject the
 * intent with the underlying error for the caller to surface.
 */
export function registerCopyToClipboardBrowser(intents: Commands): () => void {
  return intents.listen(CopyToClipboardCommand, (intent) => {
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
