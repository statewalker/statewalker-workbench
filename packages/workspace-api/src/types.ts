import type { BaseClass } from "@statewalker/shared-baseclass";
import type { FilesApi } from "@statewalker/webrun-files";

/**
 * Lifecycle hook an adapter MAY implement. `init` is not currently called by
 * the workspace (adapters are lazily constructed and do setup in their ctor);
 * it is reserved for future use. `close` runs during `workspace.close()` in
 * reverse instantiation order.
 */
export interface WorkspaceAdapter {
  init?(): void | Promise<void>;
  close?(): void | Promise<void>;
}

/**
 * Registry key type. Abstract classes (like the `Secrets` / `Settings` /
 * `SystemFiles` tokens) MUST be usable as keys — hence `abstract new`.
 */
export type AdapterCtor<T extends WorkspaceAdapter = WorkspaceAdapter> = abstract new (
  workspace: Workspace,
  ...args: unknown[]
) => T;

/**
 * Concrete implementation shape. Used as the value side of the registry —
 * callable with `new` to produce an instance.
 */
export type ConcreteAdapterCtor<T extends WorkspaceAdapter = WorkspaceAdapter> = new (
  workspace: Workspace,
  ...args: unknown[]
) => T;

export type AdapterFactory<T extends WorkspaceAdapter = WorkspaceAdapter> = (
  workspace: Workspace,
) => T;

/**
 * Observable workspace the shell app and every fragment share. Holds a single
 * primary `FilesApi` (the directory the user picked) plus a class-keyed
 * registry of capability adapters (`SystemFiles`, `Secrets`, `Settings`, etc.).
 *
 * Lifecycle: the workspace is constructed in a closed state, adapters and the
 * file system are installed via chainable `setAdapter` / `setFileSystem`, and
 * `open()` transitions into the live state. Consumers subscribe via
 * `onLoad` / `onUnload` to run per-open and per-close work; `BaseClass.onUpdate`
 * fires on any state transition including `setFileSystem` rebinds.
 */
export interface Workspace extends BaseClass {
  readonly isOpened: boolean;
  readonly label: string;
  readonly files: FilesApi;

  setFileSystem(files: FilesApi, label?: string): this;

  setAdapter<T extends WorkspaceAdapter>(type: ConcreteAdapterCtor<T>): this;
  setAdapter<T extends WorkspaceAdapter, C extends T>(
    type: AdapterCtor<T>,
    impl: ConcreteAdapterCtor<C> | AdapterFactory<C>,
  ): this;

  getAdapter<T extends WorkspaceAdapter>(type: AdapterCtor<T>): T | null;
  requireAdapter<T extends WorkspaceAdapter>(type: AdapterCtor<T>): T;

  onLoad(cb: () => void): () => void;
  onUnload(cb: () => void): () => void;

  open(): Promise<this>;
  close(): Promise<void>;
}
