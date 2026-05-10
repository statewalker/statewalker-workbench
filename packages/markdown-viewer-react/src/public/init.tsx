import { defineRegistry } from "@json-render/react";
import { newCatalogRegistry } from "@statewalker/catalog-registry";
import { provideDockTabIcon } from "@statewalker/dock-react";
import { provideMimeRenderer } from "@statewalker/files";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import {
  DOCK_LAYOUT_STORAGE_KEY,
  restorePanelSpecsFromLayout,
  SpecStore,
} from "@statewalker/spec-store";
import { getWorkspace } from "@statewalker/workspace";
import { FileText } from "lucide-react";
import { MarkdownView } from "../internal/markdown-view.js";
import {
  MARKDOWN_VIEWER_CATALOG_ID,
  makeMarkdownSpec,
  markdownViewerCatalog,
  markdownViewerPanelId,
  markdownViewerSpecId,
} from "./catalog.js";

/**
 * Renderer-only fragment for the markdown MIME viewer (per task 4.11 — the
 * paired logic fragment was dropped; its inert MIME-pattern data lives
 * inline here, registered alongside the catalog binding).
 *
 * Contributes one entry to `files:mime-renderers` for `text/markdown`
 * and one entry to `CatalogRegistry` for `MARKDOWN_VIEWER_CATALOG_ID`.
 */
export default function initMarkdownViewerReact(ctx: Record<string, unknown>): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const store = workspace.requireAdapter(SpecStore);
  const catalogs = newCatalogRegistry(workspace);

  restorePanelSpecsFromLayout({
    store,
    storage: globalThis.localStorage,
    layoutKey: DOCK_LAYOUT_STORAGE_KEY,
    panelIdPrefix: "markdown-viewer:",
    catalogId: MARKDOWN_VIEWER_CATALOG_ID,
    buildSpec: (uri) => makeMarkdownSpec(uri),
    buildSpecId: (uri) => markdownViewerSpecId(uri),
  });

  const { registry } = defineRegistry(markdownViewerCatalog, {
    components: {
      MarkdownView: ({ props }) => <MarkdownView uri={props.uri} />,
    },
    actions: {},
  });
  register(catalogs.register(MARKDOWN_VIEWER_CATALOG_ID, registry));

  register(
    provideMimeRenderer(slots, {
      mimeTypePattern: "text/markdown",
      buildPanel(uri) {
        return {
          catalogId: MARKDOWN_VIEWER_CATALOG_ID,
          spec: makeMarkdownSpec(uri),
          panelId: markdownViewerPanelId(uri),
          specId: markdownViewerSpecId(uri),
        };
      },
    }),
  );

  register(provideDockTabIcon(slots, { panelIdPrefix: "markdown-viewer:", Icon: FileText }));

  return cleanup;
}
