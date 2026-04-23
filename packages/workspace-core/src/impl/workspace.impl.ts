import type { SecretsApi, Workspace } from "@statewalker/workspace-api";
import { BaseClass } from "@statewalker/shared-baseclass";
import type { FilesApi } from "@statewalker/webrun-files";

interface WorkspaceInit {
  files: FilesApi;
  systemFiles: FilesApi;
  secrets: SecretsApi;
  label: string;
  onClose?: () => void | Promise<void>;
}

/**
 * Default `Workspace` implementation. Holds the three FilesApi/SecretsApi
 * handles that every other fragment consumes, and fires `notify()` whenever
 * `workspace.core`'s `workspace:change` handler swaps them in.
 */
export class WorkspaceImpl extends BaseClass implements Workspace {
  files: FilesApi;
  systemFiles: FilesApi;
  secrets: SecretsApi;
  label: string;

  private readonly onCloseCallback?: () => void | Promise<void>;

  constructor(init: WorkspaceInit) {
    super();
    this.files = init.files;
    this.systemFiles = init.systemFiles;
    this.secrets = init.secrets;
    this.label = init.label;
    this.onCloseCallback = init.onClose;
  }

  /**
   * Atomically swap the workspace handles and notify observers. Used by the
   * `workspace:change` handler so existing subscribers see exactly one update.
   */
  replace(next: Omit<WorkspaceInit, "onClose">): void {
    this.files = next.files;
    this.systemFiles = next.systemFiles;
    this.secrets = next.secrets;
    this.label = next.label;
    this.notify();
  }

  async close(): Promise<void> {
    await this.onCloseCallback?.();
  }
}
