import { defineCommand } from "@statewalker/shared-commands";
import type { DirectoryEntry, LoadedFile } from "./types.js";

export interface LoadDirectoryPayload {
  /** Workspace-relative path. Defaults to `/` when omitted. */
  path?: string;
  /** Recursive listing (descends into subdirectories). */
  recursive?: boolean;
}
export const LoadDirectoryCommand = defineCommand<LoadDirectoryPayload,
  readonly DirectoryEntry[]>("files:load-directory", () => {});

export interface LoadFilePayload {
  path: string;
}
export const LoadFileCommand = defineCommand<LoadFilePayload, LoadedFile>("files:load-file", () => {});

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
export const DeleteFileCommand = defineCommand<DeleteFilePayload, void>("files:delete-file", () => {});

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
export const VisualizeFileCommand = defineCommand<VisualizeFilePayload, void>("files:visualize", () => {});

export interface OpenPayload {
  /** `file://` URI or workspace-relative path of a file or directory. */
  uri: string;
  /**
   * Originating file-explorer panel id. When the URI resolves to a
   * directory, the handler routes the navigation to this panel; the
   * field is informational for files (which always open in a dock tab).
   */
  panelId?: string;
}
/**
 * Smart open: probes the URI's kind (file vs directory) and dispatches
 * — directories navigate the panel identified by `panelId`, files
 * delegate to `files:visualize`.
 */
export const OpenCommand = defineCommand<OpenPayload, void>("files:open", () => {});
