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
import { FileImage } from "lucide-react";
import { ImageView } from "../internal/image-view.js";
import {
  IMAGE_VIEWER_CATALOG_ID,
  imageViewerCatalog,
  imageViewerPanelId,
  imageViewerSpecId,
  makeImageSpec,
} from "./catalog.js";

export default function initImageViewerReact(ctx: Record<string, unknown>): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const store = workspace.requireAdapter(SpecStore);
  const catalogs = newCatalogRegistry(workspace);

  restorePanelSpecsFromLayout({
    store,
    storage: globalThis.localStorage,
    layoutKey: DOCK_LAYOUT_STORAGE_KEY,
    panelIdPrefix: "image-viewer:",
    catalogId: IMAGE_VIEWER_CATALOG_ID,
    buildSpec: (uri) => makeImageSpec(uri),
    buildSpecId: (uri) => imageViewerSpecId(uri),
  });

  const { registry } = defineRegistry(imageViewerCatalog, {
    components: {
      ImageView: ({ props }) => <ImageView uri={props.uri} />,
    },
    actions: {},
  });
  register(catalogs.register(IMAGE_VIEWER_CATALOG_ID, registry));

  register(
    provideMimeRenderer(slots, {
      mimeTypePattern: "image/*",
      buildPanel(uri) {
        return {
          catalogId: IMAGE_VIEWER_CATALOG_ID,
          spec: makeImageSpec(uri),
          panelId: imageViewerPanelId(uri),
          specId: imageViewerSpecId(uri),
        };
      },
    }),
  );

  register(provideDockTabIcon(slots, { panelIdPrefix: "image-viewer:", Icon: FileImage }));

  return cleanup;
}
