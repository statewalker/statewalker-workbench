import { defineRegistry } from "@json-render/react";
import { provideMimeRenderer } from "@statewalker/files";
import { newCatalogRegistry } from "@statewalker/json-render";
import { newRegistry } from "@statewalker/shared-registry";
import { Slots } from "@statewalker/shared-slots";
import { getWorkspace } from "@statewalker/workspace-api";
import { VideoView } from "../internal/video-view.js";
import {
  makeVideoSpec,
  VIDEO_VIEWER_CATALOG_ID,
  videoViewerCatalog,
  videoViewerPanelId,
  videoViewerSpecId,
} from "./catalog.js";

export default function initVideoViewerReact(
  ctx: Record<string, unknown>,
): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const catalogs = newCatalogRegistry(workspace);

  const { registry } = defineRegistry(videoViewerCatalog, {
    components: {
      VideoView: ({ props }) => <VideoView uri={props.uri} />,
    },
    actions: {},
  });
  register(catalogs.register(VIDEO_VIEWER_CATALOG_ID, registry));

  register(
    provideMimeRenderer(slots, {
      mimeTypePattern: "video/*",
      buildPanel(uri) {
        return {
          catalogId: VIDEO_VIEWER_CATALOG_ID,
          spec: makeVideoSpec(uri),
          panelId: videoViewerPanelId(uri),
          specId: videoViewerSpecId(uri),
        };
      },
    }),
  );

  return cleanup;
}
