# @statewalker/mime.view.markdown

## What it is

The React renderer fragment for Markdown files. It contributes a `text/markdown`
`MimeRenderer` to the `files:mime-renderers` slot of
`@statewalker/mime.core`, registers the
`markdown-viewer` json-render catalog, and binds the `MarkdownView` component
that loads a file, decodes it to text, and renders it with the shared
`Markdown` component in a dock panel.

## Why it exists

`mime.core` dispatches a URI to whichever renderer claims its MIME type but
holds no React and no concrete viewer. This package is the Markdown half of that
split (ADR-0002). Opening a `text/markdown` file via `files:visualize` lands
here, where the bytes are decoded and rendered as formatted prose.

## How to use

```sh
pnpm add @statewalker/mime.view.markdown
```

Boot the fragment (default export, also at
`@statewalker/mime.view.markdown/fragment`) and import its styles once at app
start:

```ts
import initMarkdownViewer from "@statewalker/mime.view.markdown";
import "@statewalker/mime.view.markdown/styles";

const cleanup = initMarkdownViewer(ctx); // ctx → getWorkspace(ctx)
```

`init` registers the catalog, provides the `text/markdown` renderer, restores
any `markdown-viewer:` panels from the persisted dock layout, and adds a
`FileText` dock-tab icon. After that, `files:visualize({ uri })` on a `.md` file
opens it.

## Examples

The spec helpers (re-exported for hosts that pre-allocate panels):

```ts
import {
  MARKDOWN_VIEWER_CATALOG_ID, // "markdown-viewer"
  makeMarkdownSpec,
  markdownViewerPanelId,
  markdownViewerSpecId,
} from "@statewalker/mime.view.markdown";

const plan = {
  catalogId: MARKDOWN_VIEWER_CATALOG_ID,
  spec: makeMarkdownSpec("file:///docs/readme.md"),
  panelId: markdownViewerPanelId("file:///docs/readme.md"),
  specId: markdownViewerSpecId("file:///docs/readme.md"),
};
```

`MarkdownView` is internal — `init` binds it to the catalog's `MarkdownView`
component type; it is not a public export.

## Internals

### Architectural decisions

- **Renderer-only fragment.** The paired logic fragment was dropped; the inert
  `text/markdown` MIME-pattern data lives inline in `init`, registered alongside
  the catalog binding.
- **Reuse the chat Markdown renderer.** Rendering delegates to `Markdown` from
  `@repo/chat-mini.chat-react`, so Markdown styling stays consistent with chat
  output rather than duplicating a parser.
- **URI-only spec.** The spec carries just the URI; the component fetches the
  text itself, keeping `SpecStore` patches cheap and ids deterministic so
  reopening a file focuses the existing tab.
- **Layout restore on boot.** `restorePanelSpecsFromLayout` pre-allocates specs
  for persisted `markdown-viewer:` tabs so DockView's `fromJSON()` finds them.

### Algorithms

`MarkdownView` lazy-loads the file via `LoadFileCommand` (`files:load-file`) on
mount, decodes the bytes with `TextDecoder`, and renders the string through
`<Markdown>` inside a `prose` container. State is a three-way
loading / ready / error union; the effect cancels cleanly on unmount or URI
change.

### Constraints

- Renders Markdown as decoded UTF-8 text; raw bytes are not validated as
  Markdown.
- Requires `globalThis.localStorage` for layout restore — this is a browser
  fragment.

### Dependencies

`@statewalker/mime.core` (`mimeRenderersSlot`), `@repo/chat-mini.chat-react`
(`Markdown`), `@json-render/core` + `@statewalker/render.core` /
`@statewalker/render.view.react` (catalog, specs, registry),
`@statewalker/shell.view.react` (`dockTabIconSlot`),
`@statewalker/workspace.core` / `.view.react` (`Workspace`, `LoadFileCommand`,
`useAppWorkspace`), `@statewalker/ui.view.react`, `lucide-react` (`FileText`),
`zod`. React 18+ is a peer dependency.

## Related

- `@statewalker/mime.core` — the dispatch core this builds on.
- `@statewalker/mime.view.image`, `@statewalker/mime.view.pdf`, `@statewalker/mime.view.video` — sibling renderers.

## License

MIT — see the monorepo root `LICENSE`.
