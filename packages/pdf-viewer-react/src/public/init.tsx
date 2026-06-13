import { defineRegistry } from "@json-render/react";
import { dockTabIconSlot } from "@statewalker/dock-react";
import { mimeRenderersSlot } from "@statewalker/mime.core";
import {
  catalogsSlot,
  DOCK_LAYOUT_STORAGE_KEY,
  restorePanelSpecsFromLayout,
  SpecStore,
} from "@statewalker/render.core";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace";
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
  register(slots.register(catalogsSlot, PDF_VIEWER_CATALOG_ID, registry));

  register(
    slots.provide(mimeRenderersSlot, {
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

  register(slots.provide(dockTabIconSlot, { panelIdPrefix: "pdf-viewer:", Icon: FileText }));

  return cleanup;
}
