import { getIntents } from "@statewalker/platform.api";
import { registerCopyToClipboardBrowser } from "./handlers/copy-to-clipboard.browser.js";
import { registerDownloadBlobBrowser } from "./handlers/download-blob.browser.js";
import { registerDownloadToFilesBrowser } from "./handlers/download-to-files.browser.js";
import { registerPickDirectoryBrowser } from "./handlers/pick-directory.browser.js";
import { registerPickFileBrowser } from "./handlers/pick-file.browser.js";
import { registerPreferenceGetBrowser } from "./handlers/preference-get.browser.js";
import { registerPreferenceSetBrowser } from "./handlers/preference-set.browser.js";

/**
 * Register every browser-backed handler for the `platform:*` intents against
 * the context's shared `Intents` bus. Returns a cleanup that unregisters them
 * all in reverse order.
 */
export default function initPlatformWeb(ctx: Record<string, unknown>): () => void {
  const intents = getIntents(ctx);
  const cleanups = [
    registerPickDirectoryBrowser(intents),
    registerPickFileBrowser(intents),
    registerDownloadToFilesBrowser(intents),
    registerCopyToClipboardBrowser(intents),
    registerDownloadBlobBrowser(intents),
    registerPreferenceGetBrowser(intents),
    registerPreferenceSetBrowser(intents),
  ];

  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) {
      cleanups[i]?.();
    }
  };
}
