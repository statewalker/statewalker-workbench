import type { BaseClass } from "@statewalker/shared-baseclass";
import type { FilesApi } from "@statewalker/webrun-files";

/**
 * Observable bundle a workspace publishes once a directory is opened. Every
 * other fragment consumes this — `files` for the main working set, `systemFiles`
 * for the hidden `.settings/` subtree, `secrets` for configs and credentials.
 *
 * `Workspace` extends `BaseClass`, so consumers can subscribe to `.onUpdate`
 * and react when the user switches to a different directory via
 * `workspace:change`. After the subscriber fires, re-reading `.files` etc.
 * returns the new values.
 */
export interface Workspace extends BaseClass {
  readonly files: FilesApi;
  readonly systemFiles: FilesApi;
  readonly secrets: SecretsApi;
  readonly label: string;
  close(): Promise<void>;
}

/**
 * Per-key secret storage. The default implementation writes one JSON file per
 * key under `{systemFiles}/{secretsDir}/{encodedKey}.json`. Encryption hooks
 * (`lock`, `unlock`, `isLocked`) are optional — future impls can wrap the
 * base behaviour without breaking callers.
 */
export interface SecretsApi {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<boolean>;
  list(): Promise<string[]>;
  onUpdate(cb: (changedKeys: string[]) => void): () => void;

  readonly isLocked?: boolean;
  lock?(): void;
  unlock?(password: string): Promise<boolean>;
}
