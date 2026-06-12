import { getCommands, getUrlStateView } from "@statewalker/platform-api";
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
export { registerCopyToClipboardBrowser } from "./handlers/copy-to-clipboard.browser.js";
export { registerDownloadBlobBrowser } from "./handlers/download-blob.browser.js";
export { registerDownloadToFilesBrowser } from "./handlers/download-to-files.browser.js";
export { registerPickDirectoryBrowser } from "./handlers/pick-directory.browser.js";
export { registerPickFileBrowser } from "./handlers/pick-file.browser.js";
export { registerPreferenceGetBrowser } from "./handlers/preference-get.browser.js";
export { registerPreferenceSetBrowser } from "./handlers/preference-set.browser.js";

/**
 * Register every browser-backed capability for `@statewalker/platform-api`
 * against the context's shared `Commands` bus, and bind the context's
 * `UrlStateView` to `location.hash` so navigation synchronisation activates
 * automatically. Returns a cleanup that unregisters everything in reverse.
 */
export default function initPlatformWeb(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();

  const stateView = getUrlStateView(ctx);
  register(bindUrlState(stateView));

  const commands = getCommands(ctx);
  register(registerPickDirectoryBrowser(commands));
  register(registerPickFileBrowser(commands));
  register(registerDownloadToFilesBrowser(commands));
  register(registerCopyToClipboardBrowser(commands));
  register(registerDownloadBlobBrowser(commands));
  register(registerPreferenceGetBrowser(commands));
  register(registerPreferenceSetBrowser(commands));

  return cleanup;
}
