import { defineRegistry } from "@json-render/react";
import { provideMimeRenderer } from "@statewalker/files";
import { CatalogRegistry } from "@statewalker/json-render";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { PdfView } from "../internal/pdf-view.js";
import {
  makePdfSpec,
  PDF_VIEWER_CATALOG_ID,
  pdfViewerCatalog,
  pdfViewerPanelId,
  pdfViewerSpecId,
} from "./catalog.js";

export default function initPdfViewerReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const catalogs = workspace.requireAdapter(CatalogRegistry);

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

  return cleanup;
}
