import { Command, passthrough } from "@statewalker/shared-commands";

// The primitive `files:*` filesystem commands now live in
// `@statewalker/workspace` (the workspace owns the repository role).
// Re-exported here so existing `@statewalker/files` importers keep
// resolving against the same command objects.
export {
  DeleteFileCommand,
  type DeleteFilePayload,
  type DirectoryEntry,
  LoadDirectoryCommand,
  type LoadDirectoryPayload,
  type LoadedFile,
  LoadFileCommand,
  type LoadFilePayload,
  MkdirCommand,
  type MkdirPayload,
  MoveFileCommand,
  type MoveFilePayload,
  RenameCommand,
  type RenamePayload,
  WriteFileCommand,
  type WriteFilePayload,
} from "@statewalker/workspace";

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
export const VisualizeFileCommand = Command.silent("files:visualize")
  .input(passthrough<VisualizeFilePayload>())
  .output(passthrough<void>())
  .build();

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
export const OpenCommand = Command.silent("files:open")
  .input(passthrough<OpenPayload>())
  .output(passthrough<void>())
  .build();
