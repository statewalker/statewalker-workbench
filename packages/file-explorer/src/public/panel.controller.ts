import { newRegistry } from "@statewalker/shared-registry";
import type { FileInfo, FilesApi } from "@statewalker/webrun-files";
import { FilesListModel } from "./files-list.model.js";

/**
 * Loads `path` from `files`, populates `model.entries`, restores
 * cursor to `focusName` (used when navigating up). Errors land on
 * `model.error`. Public so callers can re-use it from tests or from
 * the explorer.app two-pane preset.
 */
export async function loadDirectory(
  files: FilesApi,
  model: FilesListModel,
  path: string,
  focusName?: string,
): Promise<void> {
  const stopLoading = model.startLoading({ path });
  try {
    const entries: FileInfo[] = [];

    if (path !== "/") {
      entries.push({
        name: "..",
        path: parentPath(path),
        kind: "directory",
      });
    }

    for await (const entry of files.list(path)) {
      entries.push(entry);
    }
    stopLoading({ entries });

    if (focusName) {
      const visible = model.getVisibleEntries();
      const idx = visible.findIndex((e) => e.name === focusName);
      if (idx >= 0) {
        model.cursorIndex = idx;
        model.notify();
      }
    }
  } catch (err) {
    stopLoading({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export function parentPath(path: string): string {
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  parts.pop();
  return parts.length === 0 ? "/" : `/${parts.join("/")}`;
}

function basename(path: string): string {
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export interface PanelController {
  readonly model: FilesListModel;
  readonly files: FilesApi;
  navigate(path: string): void;
  activateEntry(): void;
  setFiles(newFiles: FilesApi, label: string): void;
  refresh(): void;
  cleanup(): void;
}

/**
 * Constructs one panel orchestrator over a `FilesApi`. Wires
 * keyboard-driven `pendingNavigation`/`pendingViewFile` events from
 * the model to disk reads.
 */
export function createPanelController(params: {
  files: FilesApi;
  title: string;
  onOpenFile?: (path: string) => void;
}): PanelController {
  const [register, cleanup] = newRegistry();
  let currentFiles = params.files;
  const { onOpenFile } = params;

  const model = new FilesListModel();
  model.setTitle(params.title);

  function navigate(path: string): void {
    const currentPath = model.path;
    const isGoingUp = currentPath.startsWith(path) && currentPath !== path;
    const focusName = isGoingUp ? basename(currentPath) : undefined;
    void loadDirectory(currentFiles, model, path, focusName);
  }

  function activateEntry(): void {
    const entry = model.getCursorEntry();
    if (!entry) return;
    if (entry.kind === "directory") {
      navigate(entry.path);
    } else if (onOpenFile) {
      onOpenFile(entry.path);
    }
  }

  function setFiles(newFiles: FilesApi, label: string): void {
    currentFiles = newFiles;
    model.setTitle(label);
    navigate("/");
  }

  function refresh(): void {
    navigate(model.path);
  }

  // Reactive bridge: when the renderer pushes pendingNavigation /
  // pendingViewFile, run them on the underlying FilesApi.
  register(
    model.onUpdate(() => {
      const navTo = model.consumeNavigation();
      if (navTo !== null) navigate(navTo);
      if (onOpenFile) {
        const viewPath = model.consumeViewFile();
        if (viewPath !== null) onOpenFile(viewPath);
      }
    }),
  );

  navigate("/");

  return {
    model,
    get files() {
      return currentFiles;
    },
    navigate,
    activateEntry,
    setFiles,
    refresh,
    cleanup,
  };
}
