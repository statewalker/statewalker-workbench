import { defineCommand } from "@statewalker/shared-commands";
import type { DirectoryEntry, LoadedFile } from "./types.js";

export interface LoadDirectoryPayload {
  /** Workspace-relative path. Defaults to `/` when omitted. */
  path?: string;
  /** Recursive listing (descends into subdirectories). */
  recursive?: boolean;
}
export const LoadDirectoryCommand = defineCommand<LoadDirectoryPayload, readonly DirectoryEntry[]>(
  "files:load-directory",
  () => {},
);

export interface LoadFilePayload {
  path: string;
}
export const LoadFileCommand = defineCommand<LoadFilePayload, LoadedFile>(
  "files:load-file",
  () => {},
);

export interface WriteFilePayload {
  path: string;
  content: Uint8Array | string;
}
export const WriteFileCommand = defineCommand<WriteFilePayload, void>("files:write-file", () => {});

export interface MoveFilePayload {
  fromPath: string;
  toPath: string;
}
export const MoveFileCommand = defineCommand<MoveFilePayload, void>("files:move-file", () => {});

export interface DeleteFilePayload {
  path: string;
}
export const DeleteFileCommand = defineCommand<DeleteFilePayload, void>(
  "files:delete-file",
  () => {},
);

export interface MkdirPayload {
  /** Workspace-relative path of the directory to create. */
  path: string;
}
export const MkdirCommand = defineCommand<MkdirPayload, void>("files:mkdir", () => {});

export interface RenamePayload {
  fromPath: string;
  toPath: string;
}
export const RenameCommand = defineCommand<RenamePayload, void>("files:rename", () => {});

export interface VisualizeFilePayload {
  /**
   * `file://` URI or workspace-relative path. The handler resolves
   * MIME type from the extension, picks a `MimeRenderer` from the
   * `files:mime-renderers` slot, and opens a DockView panel.
   */
  uri: string;
  /**
   * When set, the resulting dock panel is anchored to the panel with
   * this id (added `"within"` its group) so all file viewers land in
   * a known target — typically the main file-explorer panel — rather
   * than wherever the active group happens to be. Falls back silently
   * to default placement if no panel with this id is open.
   */
  referencePanelId?: string;
}
export const VisualizeFileCommand = defineCommand<VisualizeFilePayload, void>(
  "files:visualize",
  () => {},
);

export interface OpenPayload {
  /** `file://` URI or workspace-relative path of a file or directory. */
  uri: string;
  /**
   * Id of the file-explorer panel that initiated the open (informational —
   * useful for cross-panel features; the handler does not route folder
   * navigation here unless `target` is omitted).
   */
  origin?: string;
  /**
   * Id of the file-explorer panel that should host the folder navigation
   * when the URI resolves to a directory. Panels self-target by default
   * so folders open in-place; external callers (e.g. agents) may omit
   * this to fall back on the workspace's folder-navigation host.
   */
  target?: string;
}
/**
 * Smart open: probes the URI's kind (file vs directory) and dispatches
 * — directories navigate the panel identified by `target`, files
 * delegate to `files:visualize`.
 */
export const OpenCommand = defineCommand<OpenPayload, void>("files:open", () => {});
