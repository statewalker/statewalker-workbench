import { defineRegistry } from "@json-render/react";
import { catalogsSlot } from "@statewalker/catalog-registry";
import { dockTabIconSlot } from "@statewalker/dock-react";
import { mimeRenderersSlot } from "@statewalker/mime.core";
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
  register(slots.register(catalogsSlot, IMAGE_VIEWER_CATALOG_ID, registry));

  register(
    slots.provide(mimeRenderersSlot, {
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

  register(slots.provide(dockTabIconSlot, { panelIdPrefix: "image-viewer:", Icon: FileImage }));

  return cleanup;
}
