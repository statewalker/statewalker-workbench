import { getIntents, getUrlStateView } from "@statewalker/platform-api";
import { newRegistry } from "@statewalker/shared-registry";
import { bindUrlState } from "./bind-url-state.js";
import { registerCopyToClipboardBrowser } from "./handlers/copy-to-clipboard.browser.js";
import { registerDownloadBlobBrowser } from "./handlers/download-blob.browser.js";
import { registerDownloadToFilesBrowser } from "./handlers/download-to-files.browser.js";
import { registerPickDirectoryBrowser } from "./handlers/pick-directory.browser.js";
import { registerPickFileBrowser } from "./handlers/pick-file.browser.js";
import { registerPreferenceGetBrowser } from "./handlers/preference-get.browser.js";
import { registerPreferenceSetBrowser } from "./handlers/preference-set.browser.js";

export * from "./bind-url-state.js";

/**
 * Register every browser-backed capability for `@statewalker/platform-api`
 * against the context's shared `Intents` bus, and bind the context's
 * `UrlStateView` to `location.hash` so navigation synchronisation activates
 * automatically. Returns a cleanup that unregisters everything in reverse.
 */
export default function initPlatformWeb(
  ctx: Record<string, unknown>,
): () => void {
  const [register, cleanup] = newRegistry();

  const stateView = getUrlStateView(ctx);
  register(bindUrlState(stateView));

  const intents = getIntents(ctx);
  register(registerPickDirectoryBrowser(intents));
  register(registerPickFileBrowser(intents));
  register(registerDownloadToFilesBrowser(intents));
  register(registerCopyToClipboardBrowser(intents));
  register(registerDownloadBlobBrowser(intents));
  register(registerPreferenceGetBrowser(intents));
  register(registerPreferenceSetBrowser(intents));

  return cleanup;
}
