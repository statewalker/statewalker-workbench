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
import { FileVideo } from "lucide-react";
import { VideoView } from "../internal/video-view.js";
import {
  makeVideoSpec,
  VIDEO_VIEWER_CATALOG_ID,
  videoViewerCatalog,
  videoViewerPanelId,
  videoViewerSpecId,
} from "./catalog.js";

export default function initVideoViewerReact(ctx: Record<string, unknown>): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  const workspace = getWorkspace(ctx);
  const slots = workspace.requireAdapter(Slots);
  const store = workspace.requireAdapter(SpecStore);
  const catalogs = newCatalogRegistry(workspace);

  restorePanelSpecsFromLayout({
    store,
    storage: globalThis.localStorage,
    layoutKey: DOCK_LAYOUT_STORAGE_KEY,
    panelIdPrefix: "video-viewer:",
    catalogId: VIDEO_VIEWER_CATALOG_ID,
    buildSpec: (uri) => makeVideoSpec(uri),
    buildSpecId: (uri) => videoViewerSpecId(uri),
  });

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

  register(provideDockTabIcon(slots, { panelIdPrefix: "video-viewer:", Icon: FileVideo }));

  return cleanup;
}
