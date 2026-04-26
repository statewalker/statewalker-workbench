import {
  getIntents,
  isUserCancelled,
  runPickDirectory,
  UserCancelledError,
} from "@statewalker/platform-api";
import type { FilesApi } from "@statewalker/webrun-files";
import { ActionView, DialogView, EmptyView, publishDialog } from "@statewalker/workbench-views";

export interface RequestFileSystemDialogOptions {
  /**
   * Dialog header (window title). When omitted, the dialog is shown
   * without a visible header — the body's `heading` becomes the
   * primary label.
   */
  title?: string;
  /** Body heading (large, prominent). Defaults to "Select workspace folder". */
  heading?: string;
  /** Body description. Defaults to a sensible English fallback. */
  description?: string;
  /** Primary call-to-action button label. Defaults to "Open Folder". */
  okLabel?: string;
  /** Optional icon name (forwarded to `EmptyView.icon`). */
  icon?: string;
  /**
   * When true, render an explicit "Cancel" button in the dialog footer
   * so the user can dismiss without picking a folder. Defaults to
   * `false` — initial-open flows that have no current workspace should
   * leave the user no exit other than picking a folder; "change
   * workspace" flows should set this to `true`.
   */
  showCancel?: boolean;
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

const DONE_LABEL = "__picked";

/**
 * Builds the request-file-system dialog as a pure view-model declaration:
 * a `DialogView` whose body is an `EmptyView` (large icon + heading +
 * description + a primary `ActionView` call-to-action). Mirrors the
 * standard "empty state / drag-and-drop" pattern — the centred CTA is the
 * dialog's main affordance, not a footer button.
 *
 * Returns the view (for the host to render via `publishDialog`) and a
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
  const title = options.title; // optional — undefined means no header
  const heading = options.heading ?? "Select workspace folder";
  const description =
    options.description ??
    "Select a folder on your machine to use as the workspace root. The folder's contents become the workspace's file system.";
  const okLabel = options.okLabel ?? "Open Folder";
  const icon = options.icon ?? "folder-open";
  // OS picker still wants a window title; fall back to the body heading.
  const pickerTitle = title ?? heading;

  let pickedFiles: FilesApi | undefined;
  let pickedLabel: string | undefined;
  let pickerError: unknown;
  let resolve!: (value: RequestFileSystemResult) => void;
  let reject!: (error: unknown) => void;
  const result = new Promise<RequestFileSystemResult>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // Primary CTA — fires runPickDirectory, then closes the dialog with a
  // sentinel label. The user-cancel-of-OS-picker path leaves the dialog
  // open so the user can retry without re-mounting.
  const openAction = new ActionView({
    key: "request-file-system.open",
    label: okLabel,
    variant: "primary",
    execute: () => {
      void runPickDirectory(intents, { title: pickerTitle })
        .promise.then(({ files, label }) => {
          pickedFiles = files;
          pickedLabel = label;
          view.close(DONE_LABEL);
        })
        .catch((error: unknown) => {
          if (isUserCancelled(error)) {
            // OS picker dismissed — leave the dialog open for retry.
            return;
          }
          pickerError = error;
          view.close(DONE_LABEL);
        });
    },
  });

  const body = new EmptyView({
    key: "request-file-system.body",
    icon,
    heading,
    description,
    action: openAction,
  });

  // Footer buttons. Empty by default — the EmptyView's own CTA is the
  // primary action, and the dialog's built-in close affordance handles
  // dismissal. When `showCancel` is true (e.g. "change workspace"
  // flows where the user already has a workspace and may decide to
  // keep it), an explicit Cancel button is added so dismissal is a
  // visible choice.
  const buttons = options.showCancel
    ? [
        {
          label: options.cancelLabel ?? "Cancel",
          variant: "outline" as const,
        },
      ]
    : [];

  const view = new DialogView({
    key: "request-file-system",
    header: title,
    children: [body],
    isDismissable: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    isOpen: true,
    size: "md",
    centered: true,
    buttons,
  });

  // Branch the result promise off `waitForClose`. Resolves only when the
  // picker fed valid files; otherwise (dismiss, picker error) rejects with
  // UserCancelledError or the real picker error.
  void view.waitForClose().then((closedBy) => {
    if (pickerError !== undefined) {
      reject(pickerError);
      return;
    }
    if (closedBy === DONE_LABEL && pickedFiles !== undefined && pickedLabel !== undefined) {
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
