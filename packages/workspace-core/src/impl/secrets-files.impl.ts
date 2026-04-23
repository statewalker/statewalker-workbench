import type { SecretsApi } from "@statewalker/workspace-api";
import type { FilesApi } from "@statewalker/webrun-files";

interface SecretsFilesOptions {
  /** Backing FilesApi. Typically the workspace's `systemFiles` view. */
  files: FilesApi;
  /** Folder inside `files` where per-key JSON files live. */
  secretsDir: string;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Encode a secret key so it is safe for a filesystem name. We reserve
 * `colon`-like characters by replacing `:` and `/` with URI-style escapes,
 * and preserve round-tripping via `decode`.
 */
function encodeKey(key: string): string {
  return encodeURIComponent(key);
}

function decodeKey(encoded: string): string {
  return decodeURIComponent(encoded);
}

/**
 * Default `SecretsApi` implementation backed by per-key JSON files. Pure
 * `FilesApi` operations — runs under Node tests without any browser shim.
 *
 * Observers subscribed via `onUpdate` fire on `set` / `delete`; writes are
 * coalesced within a microtask so a burst of mutations surfaces as a single
 * notification carrying all changed keys.
 */
export class SecretsFilesImpl implements SecretsApi {
  private readonly files: FilesApi;
  private readonly secretsDir: string;
  private readonly listeners = new Set<(changedKeys: string[]) => void>();
  private pendingChanges = new Set<string>();
  private flushScheduled = false;

  readonly isLocked = false;

  constructor(options: SecretsFilesOptions) {
    this.files = options.files;
    this.secretsDir = trimSlashes(options.secretsDir);
  }

  private path(key: string): string {
    return this.secretsDir
      ? `/${this.secretsDir}/${encodeKey(key)}.json`
      : `/${encodeKey(key)}.json`;
  }

  async get(key: string): Promise<unknown | undefined> {
    const path = this.path(key);
    if (!(await this.files.exists(path))) return undefined;
    const chunks: Uint8Array[] = [];
    for await (const chunk of this.files.read(path)) {
      chunks.push(chunk);
    }
    const bytes = concatChunks(chunks);
    if (bytes.byteLength === 0) return undefined;
    try {
      return JSON.parse(textDecoder.decode(bytes)) as unknown;
    } catch {
      return undefined;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    const path = this.path(key);
    const bytes = textEncoder.encode(JSON.stringify(value));
    await this.files.write(path, [bytes]);
    this.scheduleNotify(key);
  }

  async delete(key: string): Promise<boolean> {
    const path = this.path(key);
    const removed = await this.files.remove(path);
    if (removed) this.scheduleNotify(key);
    return removed;
  }

  async list(): Promise<string[]> {
    const dir = this.secretsDir ? `/${this.secretsDir}` : "/";
    const result: string[] = [];
    try {
      for await (const entry of this.files.list(dir)) {
        if (entry.kind !== "file") continue;
        if (!entry.path.endsWith(".json")) continue;
        const filename = entry.path.split("/").pop() ?? "";
        const baseName = filename.slice(0, -".json".length);
        if (!baseName) continue;
        try {
          result.push(decodeKey(baseName));
        } catch {
          // Ignore entries whose names don't decode cleanly.
        }
      }
    } catch {
      // Directory may not exist yet.
    }
    return result;
  }

  onUpdate(cb: (changedKeys: string[]) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private scheduleNotify(key: string): void {
    this.pendingChanges.add(key);
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    queueMicrotask(() => {
      this.flushScheduled = false;
      const keys = Array.from(this.pendingChanges);
      this.pendingChanges = new Set();
      for (const listener of this.listeners) {
        listener(keys);
      }
    });
  }
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const chunk of chunks) total += chunk.byteLength;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function trimSlashes(path: string): string {
  let out = path;
  while (out.startsWith("/")) out = out.slice(1);
  while (out.endsWith("/")) out = out.slice(0, -1);
  return out;
}
