import type {
  FileInfo,
  FileStats,
  FilesApi,
  ListOptions,
  ReadOptions,
} from "@statewalker/webrun-files";
import { CompositeFilesApi } from "@statewalker/webrun-files-composite";

/**
 * A `FilesApi` decorator that makes a named prefix of the wrapped root
 * invisible: `list()` skips entries whose path starts with the prefix, and
 * any path operation (`read`, `write`, `stats`, `exists`, `remove`, `move`,
 * `copy`, `mkdir`) under the prefix behaves as if the target does not exist.
 *
 * Used by `workspace.core` to produce the "main view" — the user's workspace
 * without the `.settings/` subtree.
 */
class HidePrefixFilesApi implements FilesApi {
  private readonly source: FilesApi;
  private readonly hiddenPrefix: string;

  constructor(source: FilesApi, hiddenPrefix: string) {
    this.source = source;
    this.hiddenPrefix = normalizePrefix(hiddenPrefix);
  }

  private isHidden(path: string): boolean {
    const normalized = normalizePath(path);
    if (normalized === this.hiddenPrefix) return true;
    return normalized.startsWith(`${this.hiddenPrefix}/`);
  }

  read(path: string, options?: ReadOptions): AsyncIterable<Uint8Array> {
    if (this.isHidden(path)) return emptyAsyncIterable();
    return this.source.read(path, options);
  }

  async write(
    path: string,
    content: Iterable<Uint8Array> | AsyncIterable<Uint8Array>,
  ): Promise<void> {
    if (this.isHidden(path)) {
      throw new Error(`Path is hidden by the main workspace view: ${path}`);
    }
    await this.source.write(path, content);
  }

  async mkdir(path: string): Promise<void> {
    if (this.isHidden(path)) {
      throw new Error(`Path is hidden by the main workspace view: ${path}`);
    }
    await this.source.mkdir(path);
  }

  async *list(path: string, options?: ListOptions): AsyncIterable<FileInfo> {
    for await (const entry of this.source.list(path, options)) {
      if (this.isHidden(entry.path)) continue;
      yield entry;
    }
  }

  async stats(path: string): Promise<FileStats | undefined> {
    if (this.isHidden(path)) return undefined;
    return this.source.stats(path);
  }

  async exists(path: string): Promise<boolean> {
    if (this.isHidden(path)) return false;
    return this.source.exists(path);
  }

  async remove(path: string): Promise<boolean> {
    if (this.isHidden(path)) return false;
    return this.source.remove(path);
  }

  async move(source: string, target: string): Promise<boolean> {
    if (this.isHidden(source) || this.isHidden(target)) return false;
    return this.source.move(source, target);
  }

  async copy(source: string, target: string): Promise<boolean> {
    if (this.isHidden(source) || this.isHidden(target)) return false;
    return this.source.copy(source, target);
  }
}

/**
 * Given the raw root FilesApi the user picked, return the two views the
 * workspace publishes:
 * - `main`: the root with `{systemDir}/` hidden from every operation.
 * - `system`: the `{systemDir}/` subtree, re-rooted so `"/"` inside the view
 *   resolves to `{systemDir}/` on the underlying root.
 */
export function buildWorkspaceViews(
  root: FilesApi,
  systemDir: string,
): { main: FilesApi; system: FilesApi } {
  const normalizedSystemDir = normalizePrefix(systemDir);
  const main = new HidePrefixFilesApi(root, normalizedSystemDir);
  // CompositeFilesApi re-roots every path onto the supplied rootPath.
  const system = new CompositeFilesApi(root, normalizedSystemDir);
  return { main, system };
}

function normalizePrefix(prefix: string): string {
  if (!prefix) return "";
  const trimmed = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return trimmed.endsWith("/") && trimmed.length > 1
    ? trimmed.slice(0, -1)
    : trimmed;
}

function normalizePath(path: string): string {
  if (!path) return "/";
  const prefixed = path.startsWith("/") ? path : `/${path}`;
  return prefixed.length > 1 && prefixed.endsWith("/")
    ? prefixed.slice(0, -1)
    : prefixed;
}

async function* emptyAsyncIterable(): AsyncIterable<Uint8Array> {
  // yields nothing
}
