import { defineRegistry } from "@json-render/react";
import { provideMimeRenderer } from "@statewalker/files";
import { newCatalogRegistry } from "@statewalker/json-render";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { ImageView } from "../internal/image-view.js";
import {
  IMAGE_VIEWER_CATALOG_ID,
  imageViewerCatalog,
  imageViewerPanelId,
  imageViewerSpecId,
  makeImageSpec,
} from "./catalog.js";

export default function initImageViewerReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const catalogs = newCatalogRegistry(workspace);

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

  return cleanup;
}
