# @statewalker/mime.view.image

## What it is

The React renderer fragment for image files. It contributes an `image/*`
`MimeRenderer` to the `files:mime-renderers` slot of
`@statewalker/mime.core`, registers the
`image-viewer` json-render catalog, and binds the `ImageView` component that
loads a file and renders it as an `<img>` in a dock panel.

## Why it exists

`mime.core` dispatches a URI to whichever renderer claims its MIME type, but it
holds no React and no concrete viewer. This package is the image half of that
split (ADR-0002): the catalog/spec/ids logic plus the React component that turns
a workspace file into a rendered image. Opening an `image/*` file via
`files:visualize` lands here.

## How to use

```sh
pnpm add @statewalker/mime.view.image
```

Boot the fragment (default export, also at `@statewalker/mime.view.image/fragment`)
and import its styles once at app start:

```ts
import initImageViewer from "@statewalker/mime.view.image";
import "@statewalker/mime.view.image/styles";

const cleanup = initImageViewer(ctx); // ctx → getWorkspace(ctx)
```

`init` registers the catalog, provides the `image/*` renderer, restores any
`image-viewer:` panels from the persisted dock layout, and adds a `FileImage`
dock-tab icon. After that, `files:visualize({ uri })` on an image file opens it.

## Examples

The contributed renderer and the spec helpers (also re-exported for hosts that
pre-allocate panels):

```ts
import {
  IMAGE_VIEWER_CATALOG_ID, // "image-viewer"
  makeImageSpec,
  imageViewerPanelId,
  imageViewerSpecId,
} from "@statewalker/mime.view.image";

const plan = {
  catalogId: IMAGE_VIEWER_CATALOG_ID,
  spec: makeImageSpec("file:///photos/cat.png"),
  panelId: imageViewerPanelId("file:///photos/cat.png"),
  specId: imageViewerSpecId("file:///photos/cat.png"),
};
```

`ImageView` itself is internal — it is bound to the catalog's `ImageView`
component type by `init` and is not a public export.

## Internals

### Architectural decisions

- **Catalog + binding in one fragment.** The typed `imageViewerCatalog` (schema:
  `{ uri: string }`) and its React binding are registered together; the spec
  carries only the URI so `SpecStore` patches stay cheap.
- **URI-keyed deterministic ids.** `imageViewerPanelId` / `imageViewerSpecId`
  derive from the URI, so reopening a file focuses the existing tab.
- **Layout restore on boot.** `restorePanelSpecsFromLayout` pre-allocates specs
  for any `image-viewer:` tabs in the persisted dock layout so DockView's
  `fromJSON()` finds a spec rather than a missing-panel placeholder.

### Algorithms

`ImageView` lazy-loads the file via `LoadFileCommand` (`files:load-file`) on
mount, wraps the bytes in a `Blob` using the loaded MIME type (default
`image/png`), and renders the resulting `blob:` URL. The object URL is revoked
on unmount or URI change to avoid leaks. State is a three-way
loading / ready / error union.

### Constraints

- Renders raster and SVG images the browser can display in an `<img>`; no
  zoom/pan controls.
- Requires `globalThis.localStorage` for layout restore and a browser `URL` /
  `Blob` runtime — this is a browser fragment.

### Dependencies

`@statewalker/mime.core` (`mimeRenderersSlot`), `@json-render/core` +
`@statewalker/render.core` / `@statewalker/render.view.react` (catalog, specs,
registry), `@statewalker/shell.view.react` (`dockTabIconSlot`),
`@statewalker/workspace.core` / `.view.react` (`Workspace`, `LoadFileCommand`,
`useAppWorkspace`), `@statewalker/ui.view.react`, `lucide-react` (`FileImage`),
`zod`. React 18+ is a peer dependency.

## Related

- `@statewalker/mime.core` — the dispatch core this builds on.
- `@statewalker/mime.view.markdown`, `@statewalker/mime.view.pdf`, `@statewalker/mime.view.video` — sibling renderers.

## License

MIT — see the monorepo root `LICENSE`.
