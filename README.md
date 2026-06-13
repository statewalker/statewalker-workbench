# statewalker-workbench

Application shell and fragment platform for the statewalker ecosystem — backbone runtimes, the platform-capability vocabulary, and the canonical workbench substrate (logic + renderer fragments).

## Packages

Packages follow the **`@statewalker/${domain}.${aspect}.${modifier}`** convention
(all-dots; `aspect` ∈ `{core, view, browser, node, cloud, feature}`; a `view` leaf
— `*.view.react` / `*.view.shadcn` / `*.view.<mime>` — is the only place a UI tech
may be imported). See the `workbench-package-naming` capability spec.

### Backbone (independent runtime)

| Package | Description |
| --- | --- |
| [`@statewalker/backbone.core`](packages/backbone.core) | Backbone primitives: resolver, topo sort, activation, manifest types, vendored logger. |
| [`@statewalker/backbone.node`](packages/backbone.node) | Node bootstrap: resolves `AppManifest` against the filesystem and activates modules. |
| [`@statewalker/backbone.browser`](packages/backbone.browser) | Browser runtime: fragment loader + web-side module activation. |

### Platform capabilities

| Package | Description |
| --- | --- |
| [`@statewalker/platform.core`](packages/platform.core) | Type-only command vocabulary: pickers, downloads, clipboard, preferences, URL state. |
| [`@statewalker/platform.browser`](packages/platform.browser) | Browser implementation of the platform commands. |

### Workspace foundation

| Package | Description |
| --- | --- |
| [`@statewalker/workspace.core`](packages/workspace.core) | Workspace logic: the `Workspace` class, project/resource model, class-keyed adapters, the `files:*` filesystem commands (`WorkspaceFilesManager`), and the `workspace:change` command. |
| [`@statewalker/workspace.browser`](packages/workspace.browser) | Browser FS-Access lifecycle for the workspace: `WorkspaceShellAdapter` + `workspace:*` commands. |
| [`@statewalker/workspace.view.react`](packages/workspace.view.react) | Workspace renderer: `AppWorkspaceProvider`, `DirectoryPickerEmptyState`, `ReconnectBanner`, switch-workspace header item. |

### UI substrate

| Package | Description |
| --- | --- |
| [`@statewalker/ui.view.react`](packages/ui.view.react) | React mount, `<AppRoot>`, `core:views` slot, substrate hooks (`useSlot`, `useKeyedSlot`, `useAdapterValue`, `useAdapter`), theme binding. |
| [`@statewalker/ui.view.shadcn`](packages/ui.view.shadcn) | shadcn/ui primitives + `cn()` helper for the workbench substrate. |

### Shell (application frame)

| Package | Description |
| --- | --- |
| [`@statewalker/shell.core`](packages/shell.core) | Frame logic: `dock:*` slot keys, `dock:show-panel`/`close-panel`/`focus-panel` commands, dock state. |
| [`@statewalker/shell.view.react`](packages/shell.view.react) | Frame UI: `dockview-react` host, `MainShell`, `ShellHeader`, `JsonPanel` (registers `MainShell` into `core:views`). |

### Render engine (json-render)

| Package | Description |
| --- | --- |
| [`@statewalker/render.core`](packages/render.core) | json-render engine state (opaque, no `@json-render` dep): `SpecStore` + `spec:create`/`spec:patch` + `restorePanelSpecsFromLayout`, plus the `json:catalogs` slot. |
| [`@statewalker/render.view.react`](packages/render.view.react) | The sole `@json-render/react` boundary: `<SpecRenderer spec registry>` + `defineRegistry`/`schema` re-exports. |

### Files & MIME viewers

| Package | Description |
| --- | --- |
| [`@statewalker/mime.core`](packages/mime.core) | Mime-viewer dispatch: `files:visualize`/`files:open`, the `mime:renderers`/`mime-icons`/`editor-factories` slots, `MimeRenderer` + `pickMimeRenderer`. |
| [`@statewalker/mime.view.image`](packages/mime.view.image) | Image viewer renderer. |
| [`@statewalker/mime.view.markdown`](packages/mime.view.markdown) | Markdown viewer renderer. |
| [`@statewalker/mime.view.pdf`](packages/mime.view.pdf) | PDF viewer renderer. |
| [`@statewalker/mime.view.video`](packages/mime.view.video) | Video viewer renderer. |

### Explorer

| Package | Description |
| --- | --- |
| [`@statewalker/explorer.core`](packages/explorer.core) | File-explorer logic: navigation, search controller, tree-state, browser orchestration commands. |
| [`@statewalker/explorer.view.react`](packages/explorer.view.react) | File-explorer renderer: tree, list, drag-and-drop, context menu, breadcrumbs, search panel. |

### Settings & inline content

| Package | Description |
| --- | --- |
| [`@statewalker/settings.core`](packages/settings.core) | Settings logic: `settings:*` slots and commands. |
| [`@statewalker/settings.view.react`](packages/settings.view.react) | Settings renderer: dialog + header-items button. |
| [`@statewalker/inline.core`](packages/inline.core) | Inline-content logic: `inline-content:components` descriptor slot + types. |
| [`@statewalker/inline.view.react`](packages/inline.view.react) | Inline-content renderer: `inline-content:renderers` slot, `<InlineContent>`, built-ins. |

## Backbone independence rule

The `backbone.*` packages MUST NOT declare a runtime dependency on any other `@statewalker/*` package — including siblings in this monorepo. Backbone vendors the narrow slices it needs (currently `Logger`/`getLogger` from `@statewalker/shared-logger`) into `backbone.core/src/_vendor/`. A CI check (`scripts/check-backbone-isolation.ts`) enforces this invariant on every PR.

Substrate fragments may depend on backbone, never the reverse.

## Substrate fragment shape

Every substrate fragment package follows a single canonical layout, enforced by the `workbench-canonical-substrate` capability spec:

```
src/
  index.ts          # re-exports public/index.js
  fragment.ts       # re-exports public/init.js's default
  public/           # types, commands, slot keys, manager classes, init
  internal/         # impl + tests; not reachable through any export sub-path
  styles.css        # renderer fragments only — Tailwind v4 @source globs
```

`package.json#exports` declares exactly `"."` and `"./fragment"` for logic fragments, plus `"./styles"` for renderer fragments (the `*.view.*` leaves). `*.core` (and bare `*.view`) packages do not import React or any `*.view.*` package — the ADR-0002 boundary, keyed on the `view` leaf.

## Development

```sh
pnpm install
pnpm run build
pnpm run test
```

## Release

Releases are managed via [changesets](https://github.com/changesets/changesets):

```sh
pnpm changeset           # describe the change
pnpm version-packages    # roll versions + regenerate CHANGELOGs
pnpm release-packages    # publish to npm
```

## History

The initial commit on `main` is a fresh template expansion; pre-split history is preserved as archaeology-only branches:

- `history/backbone-common`, `history/backbone-server`, `history/backbone-web`
- `history/shared-views`, `history/shared-dom`, `history/shared-react`
- `history/shared-react-shadcn` (sourced from `shared-react.shadcn/`)
- `history/shared-react-spectrum` (sourced from `shared-react.spectrum/`)
- `history/app-shell-core` (sourced from `workspaces/workspace-explorer/apps/app.shell.core/`; package later folded into `shared-views`)

These branches are never merged into `main`; `git log` them when walking blame across the split.

## License

MIT — see `LICENSE`.
