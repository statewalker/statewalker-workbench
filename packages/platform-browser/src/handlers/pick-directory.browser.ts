import { handlePickDirectory, UserCancelledError } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";
import { BrowserFilesApi } from "@statewalker/webrun-files-browser";

/** Minimal shape of the File System Access API we rely on. Chrome/Edge only. */
interface DirectoryPickerGlobal {
  showDirectoryPicker?: (options?: {
    mode?: "read" | "readwrite";
  }) => Promise<FileSystemDirectoryHandle>;
}

/**
 * Browser default for `platform:pick-directory`. Invokes the File System Access
 * API's directory picker, wraps the returned handle into a `BrowserFilesApi`,
 * and surfaces the directory's `name` as the label. Persistence of the handle
 * is explicitly NOT done here — callers that want to remember a workspace
 * use the `platform:preference-*` intents with a serialisable identifier.
 */
export function registerPickDirectoryBrowser(intents: Intents): () => void {
  return handlePickDirectory(intents, (intent) => {
    const api = globalThis as unknown as DirectoryPickerGlobal;
    const picker = api.showDirectoryPicker;
    if (typeof picker !== "function") {
      intent.reject(new Error("showDirectoryPicker is not available in this environment"));
      return true;
    }

    picker({ mode: "readwrite" })
      .then((handle) => {
        const files = new BrowserFilesApi({ rootHandle: handle });
        intent.resolve({ files, label: handle.name });
      })
      .catch((error: unknown) => {
        intent.reject(isAbortError(error) ? new UserCancelledError() : error);
      });
    return true;
  });
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { name?: unknown }).name === "AbortError"
  );
}
