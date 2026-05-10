import { defineCatalog, type Spec } from "@json-render/core";
import { schema } from "@json-render/react";
import { z } from "zod";

/**
 * Catalog declaration for the file-explorer panel — typed schema
 * only, no React bindings. Per ADR 0002 (logic / renderer split):
 * the `file-explorer` logic fragment publishes this catalog as pure
 * data; the paired `file-explorer-react` renderer fragment binds the
 * React component for `FileExplorerView` and registers the resolved
 * entry into `CatalogRegistry`.
 *
 * One element (`FileExplorerView`) parameterised by `panelId` so each
 * dock tab gets its own controller, label, and starting path. Opening
 * via `intents.call(ShowDockPanelCommand, { panelId: fileExplorerPanelId(id), ... })`
 * yields the deterministic mapping: id → tab.
 */
export const fileExplorerCatalog = defineCatalog(schema, {
  components: {
    FileExplorerView: {
      props: z.object({
        panelId: z.string(),
        label: z.string().optional(),
        initialPath: z.string().optional(),
        mainViewerHost: z.boolean().optional(),
        folderNavigationHost: z.boolean().optional(),
      }),
    },
  },
  actions: {},
});

export const FILE_EXPLORER_CATALOG_ID = "file-explorer";

export interface FileExplorerSpecOptions {
  label?: string;
  initialPath?: string;
  mainViewerHost?: boolean;
  folderNavigationHost?: boolean;
}

export function makeFileExplorerSpec(panelId: string, options: FileExplorerSpecOptions = {}): Spec {
  return {
    root: "panel",
    elements: {
      panel: {
        type: "FileExplorerView",
        props: { panelId, ...options },
        children: [],
      },
    },
  } as Spec;
}

/** Deterministic dock panel id so reopening the same explorer tab focuses it. */
export function fileExplorerPanelId(id: string): string {
  return `file-explorer:${id}`;
}

/** Deterministic spec id; pairs with `fileExplorerPanelId`. */
export function fileExplorerSpecId(id: string): string {
  return `spec:file-explorer:${id}`;
}
