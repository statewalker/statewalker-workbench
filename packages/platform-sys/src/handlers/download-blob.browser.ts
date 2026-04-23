import { handleDownloadBlob } from "@statewalker/platform.api";
import type { Intents } from "@statewalker/shared-intents";

/**
 * Browser default for `platform:download-blob`. Creates a temporary `<a>` with
 * an object URL and synthesises a click. The object URL is revoked after the
 * click fires to avoid leaking the blob reference.
 */
export function registerDownloadBlobBrowser(intents: Intents): () => void {
  return handleDownloadBlob(intents, (intent) => {
    try {
      const { blob, filename } = intent.payload;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      // Revoke after a tick so the browser has time to handle the click.
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 0);
      intent.resolve(undefined);
    } catch (error) {
      intent.reject(error);
    }
    return true;
  });
}
