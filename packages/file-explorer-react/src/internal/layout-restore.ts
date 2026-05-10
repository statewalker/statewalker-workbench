import {
  FILE_EXPLORER_CATALOG_ID,
  fileExplorerPanelId,
  fileExplorerSpecId,
  makeFileExplorerSpec,
} from "@statewalker/file-explorer";
import type { SpecStore } from "@statewalker/json-render";

const PANEL_ID_PREFIX = "file-explorer:";

/**
 * Walk a persisted DockView layout JSON and return the file-explorer
 * panel ids embedded in panel keys matching `^file-explorer:.+$`.
 * Defensive against shape changes in DockView's serialization — only
 * reads panel ids, ignores everything else.
 *
 * Exported separately for unit testing without touching localStorage.
 */
export function extractFileExplorerPanelIds(layoutJson: unknown): string[] {
  if (!layoutJson || typeof layoutJson !== "object") return [];
  const panels = (layoutJson as { panels?: unknown }).panels;
  if (!panels || typeof panels !== "object") return [];
  const ids: string[] = [];
  for (const panelId of Object.keys(panels)) {
    if (panelId.startsWith(PANEL_ID_PREFIX) && panelId.length > PANEL_ID_PREFIX.length) {
      ids.push(panelId.slice(PANEL_ID_PREFIX.length));
    }
  }
  return ids;
}

/**
 * On boot (BEFORE React mounts and the DockHost calls `fromJSON`),
 * pre-allocate file-explorer specs for every panel id in the
 * persisted layout so restored tabs find their spec in `SpecStore`
 * and render content immediately. Without this pass, every restored
 * file-explorer tab flashes the `PanelMissing` placeholder until the
 * preset re-application catches up.
 *
 * Idempotent: skips ids whose specs already exist, so repeat calls
 * (hot reload, double-mount in StrictMode) are safe. Mirrors
 * `restoreChatSpecsFromLayout` in `@repo/chat-mini.chat`.
 *
 * Layout source is currently localStorage (the DockHost's
 * `chat-mini:dock-layout` key, shared across apps); migrates to
 * `SystemFiles/dock-layout.json` alongside the dock fragment's
 * persistence migration in Wave 3.
 */
export function restoreFileExplorerSpecsFromLayout(
  store: SpecStore,
  storage: Storage | undefined,
  layoutKey: string,
): void {
  if (!storage) return;
  const raw = storage.getItem(layoutKey);
  if (!raw) return;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  for (const id of extractFileExplorerPanelIds(parsed)) {
    const specId = fileExplorerSpecId(id);
    if (store.get(specId)) continue;
    store.create({
      id: specId,
      catalogId: FILE_EXPLORER_CATALOG_ID,
      spec: makeFileExplorerSpec(id),
      meta: { persistent: true },
    });
  }
}

/** Re-export the helper used by callers that already know the id. */
export { fileExplorerPanelId };
