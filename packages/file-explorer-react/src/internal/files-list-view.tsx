import type { FilesListModel } from "@statewalker/file-explorer";
import { Loader2 } from "lucide-react";
import type { DragEvent, ReactElement } from "react";
import { Breadcrumb } from "./breadcrumb.js";
import { FileRow } from "./file-row.js";
import { useViewModel } from "./use-view-model.js";

interface FilesListViewProps {
  model: FilesListModel;
  /** Stable id used as the DnD `application/x-fe-panel` channel. */
  panelId: string;
}

/** Panel-internal list view: breadcrumb + filter + sortable table. */
export function FilesListView({ model, panelId }: FilesListViewProps): ReactElement {
  useViewModel(model);

  const visible = model.getDisplayEntries();
  const dirCount = visible.filter((e) => e.kind === "directory" && e.name !== "..").length;
  const fileCount = visible.filter((e) => e.kind === "file").length;
  const parts: string[] = [];
  if (dirCount > 0) parts.push(`${dirCount} dir${dirCount > 1 ? "s" : ""}`);
  if (fileCount > 0) parts.push(`${fileCount} file${fileCount > 1 ? "s" : ""}`);
  if (model.selectedPaths.size > 0) parts.push(`${model.selectedPaths.size} selected`);
  if (model.filter) parts.push(`filter: "${model.filter}"`);
  const footerText = parts.join(", ") || "Empty";

  function handleNavigate(path: string): void {
    model.requestNavigation(path);
  }

  function handleSelect(index: number): void {
    model.cursorIndex = index;
    model.notify();
  }

  function handleActivate(index: number): void {
    model.cursorIndex = index;
    model.requestActivateEntry();
  }

  function handleDragStart(e: DragEvent, path: string): void {
    const paths = model.selectedPaths.size > 0 ? [...model.selectedPaths] : [path];
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData("text/plain", paths.join("\n"));
    e.dataTransfer.setData("application/x-fe-panel", panelId);
  }

  function sortIndicator(field: "name" | "size" | "lastModified"): string {
    if (model.sortField !== field) return "";
    return model.sortAscending ? " ▲" : " ▼";
  }

  return (
    <div
      className="fe-panel flex flex-col h-full"
      data-fe-panel={panelId}
      tabIndex={0}
      onKeyDown={(e) => {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            model.moveCursor(-1);
            break;
          case "ArrowDown":
            e.preventDefault();
            model.moveCursor(1);
            break;
          case "PageUp":
            e.preventDefault();
            model.moveCursor(-model.pageSize);
            break;
          case "PageDown":
            e.preventDefault();
            model.moveCursor(model.pageSize);
            break;
          case "Home":
            e.preventDefault();
            model.cursorIndex = 0;
            model.notify();
            break;
          case "End":
            e.preventDefault();
            model.cursorIndex = Math.max(0, model.getVisibleEntries().length - 1);
            model.notify();
            break;
          case "Enter":
            e.preventDefault();
            model.requestActivateEntry();
            break;
          case "Backspace":
            e.preventDefault();
            model.requestNavigateToParent();
            break;
          case "Insert":
            e.preventDefault();
            model.toggleSelect(model.cursorIndex);
            model.moveCursor(1);
            break;
          default:
            break;
        }
      }}
    >
      <div className="flex items-center gap-2 py-1 px-2 border-b border-border/50">
        <Breadcrumb path={model.path} onNavigate={handleNavigate} />
        {model.loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>
      <div className="px-2 py-1 border-b border-border/50">
        <input
          type="text"
          className="text-xs px-2 py-1 border rounded bg-background w-full"
          placeholder="Filter..."
          value={model.filter}
          onChange={(e) => model.setFilter(e.target.value)}
        />
      </div>
      {model.error && (
        <div className="text-sm text-destructive px-2 py-1 border-b border-border/50">
          {model.error}
        </div>
      )}
      <div className="flex items-center text-xs font-medium border-b border-border/50 bg-muted/30 px-3 py-1 select-none">
        <button
          type="button"
          className="flex-1 text-left hover:underline cursor-pointer"
          onClick={() => model.setSort("name")}
        >
          Name{sortIndicator("name")}
        </button>
        <button
          type="button"
          className="w-20 text-right hover:underline cursor-pointer"
          onClick={() => model.setSort("size")}
        >
          Size{sortIndicator("size")}
        </button>
        <button
          type="button"
          className="w-28 text-right hover:underline cursor-pointer"
          onClick={() => model.setSort("lastModified")}
        >
          Modified{sortIndicator("lastModified")}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {visible.map((entry, i) => (
          <FileRow
            key={entry.path}
            entry={entry}
            isCursor={i === model.cursorIndex}
            isSelected={model.selectedPaths.has(entry.path)}
            draggable={entry.name !== ".."}
            onSelect={() => handleSelect(i)}
            onActivate={() => handleActivate(i)}
            onDragStart={(e) => handleDragStart(e, entry.path)}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground px-2 py-1 border-t border-border/50">
        {footerText}
      </div>
    </div>
  );
}
