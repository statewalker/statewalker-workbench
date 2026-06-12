import { createFileTools } from "@statewalker/ai-agent/tools";
import { agentToolsSlot } from "@statewalker/ai-agent-runtime";
import { ShowDockPanelCommand } from "@statewalker/dock";
import { Commands } from "@statewalker/shared-commands";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { SpecStore } from "@statewalker/spec-store";
import { extname, readFile, writeText } from "@statewalker/webrun-files";
import type { Workspace } from "@statewalker/workspace";
import {
  DeleteFileCommand,
  LoadDirectoryCommand,
  LoadFileCommand,
  MkdirCommand,
  MoveFileCommand,
  RenameCommand,
  VisualizeFileCommand,
  WriteFileCommand,
} from "../public/commands.js";
import { pickMimeRenderer } from "../public/pick-mime-renderer.js";
import type { DirectoryEntry, LoadedFile, MimeRenderer } from "../public/types.js";

export interface FilesManagerOptions {
  workspace: Workspace;
}

/**
 * Re-entrant orchestrator for the files fragment.
 *
 * On `workspace.onLoad`:
 *   - Contributes a `ToolFactory` to `agent:tools` that closes over
 *     the current `workspace.files`. The agent-runtime manager
 *     observes the slot and rebuilds the AgentRuntime with the
 *     contributed tools.
 *
 * Lifetime-scoped:
 *   - Registers `files:*` command handlers against the workspace's
 *     primary `FilesApi`. Handlers no-op while the workspace is
 *     closed (they `reject` with a clear error message).
 *
 * `files:visualize` resolves a matching `MimeRenderer` from the
 * slot, calls `buildPanel(uri)` to obtain spec + deterministic ids,
 * registers the spec in `SpecStore`, and opens a dock panel via
 * `runShowDockPanel`. Spec eviction on panel close is owned by the
 * dock manager (non-persistent specs evict on last unmount).
 */
export class FilesManager {
  private readonly workspace: Workspace;
  private readonly commands: Commands;
  private readonly slots: Slots;
  private readonly store: SpecStore;
  private readonly _cleanup: () => Promise<void>;
  private _cycleCleanup: Array<() => void> = [];

  constructor({ workspace }: FilesManagerOptions) {
    this.workspace = workspace;
    this.commands = workspace.requireAdapter(Commands);
    this.slots = workspace.requireAdapter(Slots);
    this.store = workspace.requireAdapter(SpecStore);

    const [register, cleanup] = newRegistry();
    this._cleanup = cleanup;

    // ── Command handlers (lifetime-scoped) ───────────────────────
    register(
      this.commands.listen(LoadDirectoryCommand, (cmd) => {
        const path = cmd.payload?.path ?? "/";
        const recursive = cmd.payload?.recursive ?? false;
        void this._loadDirectory(path, recursive)
          .then((entries) => cmd.resolve(entries))
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(LoadFileCommand, (cmd) => {
        void this._loadFile(cmd.payload.path)
          .then((file) => cmd.resolve(file))
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(WriteFileCommand, (cmd) => {
        void this._writeFile(cmd.payload.path, cmd.payload.content)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(MoveFileCommand, (cmd) => {
        void this._moveFile(cmd.payload.fromPath, cmd.payload.toPath)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(DeleteFileCommand, (cmd) => {
        void this._deleteFile(cmd.payload.path)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(MkdirCommand, (cmd) => {
        void this._mkdir(cmd.payload.path)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(RenameCommand, (cmd) => {
        void this._moveFile(cmd.payload.fromPath, cmd.payload.toPath)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );
    register(
      this.commands.listen(VisualizeFileCommand, (cmd) => {
        const { uri, referencePanelId } = cmd.payload;
        const mime = guessMimeType(uri);
        const renderer = pickMimeRenderer(this.slots, mime);
        if (!renderer) {
          cmd.reject(new Error(`No mime-renderer registered for "${mime}"`));
          return true;
        }
        void this._openVisualizePanel(renderer, uri, referencePanelId)
          .then(() => cmd.resolve())
          .catch((error) => cmd.reject(error));
        return true;
      }),
    );

    // ── Per-cycle: agent:tools contribution ─────────────────────
    register(workspace.onLoad(() => this._onLoad()));
    register(workspace.onUnload(() => this._onUnload()));

    if (workspace.isOpened) this._onLoad();
  }

  async close(): Promise<void> {
    this._onUnload();
    await this._cleanup();
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  private _onLoad(): void {
    const files = this.workspace.files;
    // Contribute a ToolFactory closing over the current files
    // view. AgentRuntime calls the factory during build, passing
    // its own filtered files-tools view (system path hidden).
    this._cycleCleanup.push(
      this.slots.provide(agentToolsSlot, (ctx) => createFileTools(ctx.files)),
    );
    // Hold a reference so the closure target stays in scope; the
    // factory itself ignores `files` from this scope (uses
    // `ctx.files` which is the agent-runtime tools view), but
    // future overrides (e.g. plug-in path filters) may want it.
    void files;
  }

  private _onUnload(): void {
    for (const dispose of this._cycleCleanup) {
      try {
        dispose();
      } catch (err) {
        console.error("[files] cycle cleanup threw:", err);
      }
    }
    this._cycleCleanup = [];
  }

  // ── Command handler implementations ────────────────────────────

  private async _loadDirectory(
    path: string,
    recursive: boolean,
  ): Promise<readonly DirectoryEntry[]> {
    this._requireOpen();
    const entries: DirectoryEntry[] = [];
    for await (const info of this.workspace.files.list(path, { recursive })) {
      entries.push({ ...info, mimeType: guessMimeType(info.path) });
    }
    return entries;
  }

  private async _loadFile(path: string): Promise<LoadedFile> {
    this._requireOpen();
    const bytes = await readFile(this.workspace.files, path);
    const stats = await this.workspace.files.stats(path);
    return { path, bytes, stats, mimeType: guessMimeType(path) };
  }

  private async _writeFile(path: string, content: Uint8Array | string): Promise<void> {
    this._requireOpen();
    if (typeof content === "string") {
      await writeText(this.workspace.files, path, content);
    } else {
      await this.workspace.files.write(path, [content]);
    }
  }

  private async _moveFile(from: string, to: string): Promise<void> {
    this._requireOpen();
    const ok = await this.workspace.files.move(from, to);
    if (!ok) throw new Error(`move failed: source missing: ${from}`);
  }

  private async _deleteFile(path: string): Promise<void> {
    this._requireOpen();
    await this.workspace.files.remove(path);
  }

  private async _mkdir(path: string): Promise<void> {
    this._requireOpen();
    await this.workspace.files.mkdir(path);
  }

  private _requireOpen(): void {
    if (!this.workspace.isOpened) {
      throw new Error("files:* commands require an open workspace — call runChangeWorkspace first");
    }
  }

  private async _openVisualizePanel(
    renderer: MimeRenderer,
    uri: string,
    referencePanelId: string | undefined,
  ): Promise<void> {
    const plan = renderer.buildPanel(uri);
    if (!this.store.get(plan.specId)) {
      this.store.create({
        id: plan.specId,
        catalogId: plan.catalogId,
        spec: plan.spec,
        // Non-persistent: dock manager evicts on last panel close.
      });
    }
    await this.commands.call(ShowDockPanelCommand, {
      panelId: plan.panelId,
      specId: plan.specId,
      title: filenameFromUri(uri),
      referencePanelId,
    }).promise;
  }
}

// ── MIME / renderer helpers ─────────────────────────────────────

const MIME_TYPES: Readonly<Record<string, string>> = {
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".txt": "text/plain",
  ".json": "application/json",
  ".js": "text/javascript",
  ".ts": "text/typescript",
  ".tsx": "text/typescript",
  ".jsx": "text/javascript",
  ".html": "text/html",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
};

export function guessMimeType(pathOrUri: string): string {
  const ext = extname(pathOrUri.replace(/^file:\/\//, "")).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

/** Last path segment of a file URI/path, with the `file://` scheme stripped. */
export function filenameFromUri(uriOrPath: string): string {
  const cleaned = uriOrPath.replace(/^file:\/\//, "").replace(/\/+$/, "");
  const lastSlash = cleaned.lastIndexOf("/");
  return lastSlash >= 0 ? cleaned.slice(lastSlash + 1) : cleaned;
}

export function pickRenderer(
  renderers: readonly MimeRenderer[],
  mimeType: string,
): MimeRenderer | undefined {
  const matches = renderers.filter((r) => matchMime(r.mimeTypePattern, mimeType));
  if (matches.length === 0) return undefined;
  matches.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  return matches[0];
}

function matchMime(pattern: string, mimeType: string): boolean {
  if (pattern === mimeType) return true;
  if (!pattern.includes("*")) return false;
  // Convert glob-with-* to a regex anchored at both ends.
  const regex = new RegExp(
    `^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`,
  );
  return regex.test(mimeType);
}
