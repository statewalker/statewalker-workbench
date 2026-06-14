# @statewalker/mime.view.video

## What it is

The React renderer fragment for video files. It contributes a `video/*`
`MimeRenderer` to the `files:mime-renderers` slot of
`@statewalker/mime.core`, registers the
`video-viewer` json-render catalog, and binds the `VideoView` component that
loads a file and plays it with an HTML `<video controls>` element in a dock
panel.

## Why it exists

`mime.core` dispatches a URI to whichever renderer claims its MIME type but
holds no React and no concrete viewer. This package is the video half of that
split (ADR-0002). Opening a `video/*` file via `files:visualize` lands here.

## How to use

```sh
pnpm add @statewalker/mime.view.video
```

Boot the fragment (default export, also at
`@statewalker/mime.view.video/fragment`) and import its styles once at app
start:

```ts
import initVideoViewer from "@statewalker/mime.view.video";
import "@statewalker/mime.view.video/styles";

const cleanup = initVideoViewer(ctx); // ctx → getWorkspace(ctx)
```

`init` registers the catalog, provides the `video/*` renderer, restores any
`video-viewer:` panels from the persisted dock layout, and adds a `FileVideo`
dock-tab icon. After that, `files:visualize({ uri })` on a video file opens it.

## Examples

The spec helpers (re-exported for hosts that pre-allocate panels):

```ts
import {
  VIDEO_VIEWER_CATALOG_ID, // "video-viewer"
  makeVideoSpec,
  videoViewerPanelId,
  videoViewerSpecId,
} from "@statewalker/mime.view.video";

const plan = {
  catalogId: VIDEO_VIEWER_CATALOG_ID,
  spec: makeVideoSpec("file:///clips/intro.mp4"),
  panelId: videoViewerPanelId("file:///clips/intro.mp4"),
  specId: videoViewerSpecId("file:///clips/intro.mp4"),
};
```

`VideoView` is internal — `init` binds it to the catalog's `VideoView`
component type; it is not a public export.

## Internals

### Architectural decisions

- **Browser-native playback.** Rendering delegates to a `<video controls>`
  element; no custom player or transcoding. Playback support is whatever the
  host browser offers for the source codec.
- **URI-only spec, deterministic ids.** The spec carries just the URI;
  `videoViewerPanelId` / `videoViewerSpecId` key off it so reopening a file
  focuses the existing tab.
- **Layout restore on boot.** `restorePanelSpecsFromLayout` pre-allocates specs
  for persisted `video-viewer:` tabs so DockView's `fromJSON()` finds them.

### Algorithms

`VideoView` lazy-loads the file via `LoadFileCommand` (`files:load-file`) on
mount, wraps the bytes in a `Blob` using the loaded MIME type (default
`video/mp4`), and points the `<video>` at the resulting `blob:` URL. The object
URL is revoked on unmount or URI change. State is a three-way
loading / ready / error union. An empty `<track kind="captions">` is included
for accessibility markup.

### Constraints

- Whole-file load: the entire video is read into a `Blob` before playback, so
  very large files are not streamed.
- Codec/container support depends on the browser.
- Requires `globalThis.localStorage` for layout restore and a browser `URL` /
  `Blob` runtime — this is a browser fragment.

### Dependencies

`@statewalker/mime.core` (`mimeRenderersSlot`), `@json-render/core` +
`@statewalker/render.core` / `@statewalker/render.view.react` (catalog, specs,
registry), `@statewalker/shell.view.react` (`dockTabIconSlot`),
`@statewalker/workspace.core` / `.view.react` (`Workspace`, `LoadFileCommand`,
`useAppWorkspace`), `@statewalker/ui.view.react`, `lucide-react` (`FileVideo`),
`zod`. React 18+ is a peer dependency.

## Related

- `@statewalker/mime.core` — the dispatch core this builds on.
- `@statewalker/mime.view.image`, `@statewalker/mime.view.markdown`, `@statewalker/mime.view.pdf` — sibling renderers.

## License

MIT — see the monorepo root `LICENSE`.
