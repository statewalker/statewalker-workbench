import { SystemFiles, type Workspace } from "@statewalker/workspace-api";
import type { FilesApi } from "@statewalker/webrun-files";
import { buildWorkspaceViews } from "./composite-setup.ts";

/**
 * Default `SystemFiles` impl. Produces a `FilesApi` rooted at `systemDir`
 * of the workspace's primary file system, via `buildWorkspaceViews`'s
 * composite subtree view.
 */
export class FilesBackedSystemFiles extends SystemFiles {
  readonly files: FilesApi;

  constructor(workspace: Workspace, systemDir: string) {
    super();
    const { system } = buildWorkspaceViews(workspace.files, systemDir);
    this.files = system;
  }
}
