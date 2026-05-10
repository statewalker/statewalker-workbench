import { defineRegistry } from "@json-render/react";
import { provideDockTabIcon } from "@statewalker/dock-react";
import { provideMimeRenderer } from "@statewalker/files";
import {
  DOCK_LAYOUT_STORAGE_KEY,
  newCatalogRegistry,
  restorePanelSpecsFromLayout,
  SpecStore,
} from "@statewalker/json-render";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { FileText } from "lucide-react";
import { PdfView } from "../internal/pdf-view.js";
import {
  makePdfSpec,
  PDF_VIEWER_CATALOG_ID,
  pdfViewerCatalog,
  pdfViewerPanelId,
  pdfViewerSpecId,
} from "./catalog.js";

export default function initPdfViewerReact(ctx: Record<string, unknown>): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const store = workspace.requireAdapter(SpecStore);
  const catalogs = newCatalogRegistry(workspace);

  // Pre-allocate specs for any pdf-viewer tabs in the persisted dock
  // layout so DockView's fromJSON() — which fires when the React tree
  // mounts — finds a spec instead of the PanelMissing placeholder.
  restorePanelSpecsFromLayout({
    store,
    storage: globalThis.localStorage,
    layoutKey: DOCK_LAYOUT_STORAGE_KEY,
    panelIdPrefix: "pdf-viewer:",
    catalogId: PDF_VIEWER_CATALOG_ID,
    buildSpec: (uri) => makePdfSpec(uri),
    buildSpecId: (uri) => pdfViewerSpecId(uri),
  });

  const { registry } = defineRegistry(pdfViewerCatalog, {
    components: {
      PdfView: ({ props }) => <PdfView uri={props.uri} />,
    },
    actions: {},
  });
  register(catalogs.register(PDF_VIEWER_CATALOG_ID, registry));

  register(
    provideMimeRenderer(slots, {
      mimeTypePattern: "application/pdf",
      buildPanel(uri) {
        return {
          catalogId: PDF_VIEWER_CATALOG_ID,
          spec: makePdfSpec(uri),
          panelId: pdfViewerPanelId(uri),
          specId: pdfViewerSpecId(uri),
        };
      },
    }),
  );

  register(provideDockTabIcon(slots, { panelIdPrefix: "pdf-viewer:", Icon: FileText }));

  return cleanup;
}
