import {
  getIntents,
  isUserCancelled,
  runPickDirectory,
  UserCancelledError,
} from "@statewalker/platform-api";
import type { FilesApi } from "@statewalker/webrun-files";
import { ContentPanelView, DialogView, publishDialog } from "@statewalker/workbench-views";

export interface RequestFileSystemDialogOptions {
  /** Dialog header. Defaults to "Open workspace folder". */
  title?: string;
  /** Body description. Defaults to a sensible English fallback. */
  description?: string;
  /** Primary "Open Folder" button label. Defaults to "Open Folder". */
  okLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
}

export interface RequestFileSystemResult {
  files: FilesApi;
  label: string;
}

export interface RequestFileSystemDialog {
  view: DialogView;
  result: Promise<RequestFileSystemResult>;
}

/**
 * Builds the request-file-system dialog as a pure view-model declaration:
 * a `DialogView` wrapping a `ContentPanelView` (header + description) plus
 * Cancel / "Open Folder" buttons in `DialogView.buttons`. The factory
 * returns the view (for the host to render via `publishDialog`) and a
 * result promise that resolves with `{ files, label }` when the user picks
 * a folder, or rejects with `UserCancelledError` when the user dismisses
 * the dialog or the OS directory picker.
 *
 * This factory is strictly UI-toolkit-neutral: it imports only from
 * `@statewalker/workbench-views` and `@statewalker/platform-api`. It does
 * not touch `document`, `window`, or any UI binding.
 */
export function buildRequestFileSystemDialog(
  ctx: Record<string, unknown>,
  options: RequestFileSystemDialogOptions = {},
): RequestFileSystemDialog {
  const intents = getIntents(ctx);
  const title = options.title ?? "Open workspace folder";
  const description =
    options.description ?? "Select a folder on your machine to use as the workspace root.";
  const okLabel = options.okLabel ?? "Open Folder";
  const cancelLabel = options.cancelLabel ?? "Cancel";

  let pickedFiles: FilesApi | undefined;
  let pickedLabel: string | undefined;
  let pickerError: unknown;
  let resolve!: (value: RequestFileSystemResult) => void;
  let reject!: (error: unknown) => void;
  const result = new Promise<RequestFileSystemResult>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const view = new DialogView({
    key: "request-file-system",
    header: title,
    children: [new ContentPanelView({ key: "request-file-system.body", header: description })],
    isDismissable: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    isOpen: true,
    buttons: [
      { label: cancelLabel, variant: "ghost" },
      {
        label: okLabel,
        variant: "default",
        // Returning `false` keeps the dialog open; returning anything else
        // tells the renderer to call `view.close(label)` and remove from
        // the registry. We veto close on user-cancel of the OS picker so
        // the user can retry; on success or real error we let the dialog
        // close with the OK label and let the result-promise branching
        // (in the waitForClose watcher below) decide resolve vs. reject.
        onClick: () => {
          // Synchronously kick off the picker. The renderer will close the
          // dialog AFTER this handler returns; we have to defer that close
          // until the picker settles. So always return `false` here, and
          // call `view.close(...)` ourselves once the picker resolves.
          void runPickDirectory(intents, { title })
            .then(({ files, label }) => {
              pickedFiles = files;
              pickedLabel = label;
              view.close(okLabel);
            })
            .catch((error: unknown) => {
              if (isUserCancelled(error)) {
                // OS picker dismissed — leave the dialog open for retry.
                return;
              }
              pickerError = error;
              view.close(okLabel);
            });
          return false;
        },
      },
    ],
  });

  // Branch the result promise off `waitForClose`. Resolves only when the
  // picker fed valid files; otherwise (cancel button, dismiss, picker
  // error) rejects with UserCancelledError or the real picker error.
  void view.waitForClose().then((closedBy) => {
    if (pickerError !== undefined) {
      reject(pickerError);
      return;
    }
    if (closedBy === okLabel && pickedFiles !== undefined && pickedLabel !== undefined) {
      resolve({ files: pickedFiles, label: pickedLabel });
      return;
    }
    reject(new UserCancelledError("Workspace dialog dismissed"));
  });

  return { view, result };
}

/**
 * Opens the request-file-system dialog by publishing the view-model into
 * `DialogStackView` and awaiting the user's choice. The unpublish callback
 * returned by `publishDialog` is invoked in a `try/finally` so the dialog
 * is removed from the registry whether the user picks or dismisses.
 */
export async function openRequestFileSystemDialog(
  ctx: Record<string, unknown>,
  options: RequestFileSystemDialogOptions = {},
): Promise<RequestFileSystemResult> {
  const { view, result } = buildRequestFileSystemDialog(ctx, options);
  const unpublish = publishDialog(ctx, view);
  try {
    return await result;
  } finally {
    unpublish();
  }
}
