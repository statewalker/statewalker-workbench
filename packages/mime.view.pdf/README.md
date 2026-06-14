# @statewalker/mime.view.pdf

## What it is

The React renderer fragment for PDF files. It contributes an `application/pdf`
`MimeRenderer` to the `files:mime-renderers` slot of
`@statewalker/mime.core`, registers the `pdf-viewer`
json-render catalog, and binds the `PdfView` component that loads a file and
hands it to the browser's built-in PDF viewer via an `<embed>` in a dock panel.

## Why it exists

`mime.core` dispatches a URI to whichever renderer claims its MIME type but
holds no React and no concrete viewer. This package is the PDF half of that
split (ADR-0002). Opening an `application/pdf` file via `files:visualize` lands
here.

## How to use

```sh
pnpm add @statewalker/mime.view.pdf
```

Boot the fragment (default export, also at `@statewalker/mime.view.pdf/fragment`)
and import its styles once at app start:

```ts
import initPdfViewer from "@statewalker/mime.view.pdf";
import "@statewalker/mime.view.pdf/styles";

const cleanup = initPdfViewer(ctx); // ctx → getWorkspace(ctx)
```

`init` registers the catalog, provides the `application/pdf` renderer, restores
any `pdf-viewer:` panels from the persisted dock layout, and adds a `FileText`
dock-tab icon. After that, `files:visualize({ uri })` on a `.pdf` file opens it.

## Examples

The spec helpers (re-exported for hosts that pre-allocate panels):

```ts
import {
  PDF_VIEWER_CATALOG_ID, // "pdf-viewer"
  makePdfSpec,
  pdfViewerPanelId,
  pdfViewerSpecId,
} from "@statewalker/mime.view.pdf";

const plan = {
  catalogId: PDF_VIEWER_CATALOG_ID,
  spec: makePdfSpec("file:///docs/report.pdf"),
  panelId: pdfViewerPanelId("file:///docs/report.pdf"),
  specId: pdfViewerSpecId("file:///docs/report.pdf"),
};
```

`PdfView` is internal — `init` binds it to the catalog's `PdfView` component
type; it is not a public export.

## Internals

### Architectural decisions

- **Browser-native viewer.** Rendering delegates to an `<embed type="application/pdf">`,
  i.e. the browser's built-in PDF viewer. PDF.js is explicitly out of scope for
  v1 — no rendering engine is bundled.
- **URI-only spec, deterministic ids.** The spec carries just the URI;
  `pdfViewerPanelId` / `pdfViewerSpecId` key off it so reopening a file focuses
  the existing tab.
- **Layout restore on boot.** `restorePanelSpecsFromLayout` pre-allocates specs
  for persisted `pdf-viewer:` tabs so DockView's `fromJSON()` finds a spec
  instead of a missing-panel placeholder when the React tree mounts.

### Algorithms

`PdfView` lazy-loads the file via `LoadFileCommand` (`files:load-file`) on
mount, wraps the bytes in a `Blob` typed `application/pdf`, and points the
`<embed>` at the resulting `blob:` URL. The object URL is revoked on unmount or
URI change. State is a three-way loading / ready / error union.

### Constraints

- Relies on the host browser shipping a PDF viewer; no in-app annotation,
  search, or page navigation beyond what the browser provides.
- Requires `globalThis.localStorage` for layout restore and a browser `URL` /
  `Blob` runtime — this is a browser fragment.

### Dependencies

`@statewalker/mime.core` (`mimeRenderersSlot`), `@json-render/core` +
`@statewalker/render.core` / `@statewalker/render.view.react` (catalog, specs,
registry), `@statewalker/shell.view.react` (`dockTabIconSlot`),
`@statewalker/workspace.core` / `.view.react` (`Workspace`, `LoadFileCommand`,
`useAppWorkspace`), `@statewalker/ui.view.react`, `lucide-react` (`FileText`),
`zod`. React 18+ is a peer dependency.

## Related

- `@statewalker/mime.core` — the dispatch core this builds on.
- `@statewalker/mime.view.image`, `@statewalker/mime.view.markdown`, `@statewalker/mime.view.video` — sibling renderers.

## License

MIT — see the monorepo root `LICENSE`.
