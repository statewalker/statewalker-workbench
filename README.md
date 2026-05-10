# statewalker-workbench

Application shell and fragment platform for the statewalker ecosystem — backbone runtimes, the platform-capability vocabulary, and the canonical workbench substrate (logic + renderer fragments).

## Packages

### Backbone (independent runtime)

| Package | Description |
| --- | --- |
| [`@statewalker/backbone-common`](packages/backbone-common) | Backbone primitives: resolver, topo sort, activation, manifest types, vendored logger. |
| [`@statewalker/backbone-server`](packages/backbone-server) | Node bootstrap: resolves `AppManifest` against the filesystem and activates modules. |
| [`@statewalker/backbone-web`](packages/backbone-web) | Browser runtime: fragment loader + web-side module activation. |

### Platform capabilities

| Package | Description |
| --- | --- |
| [`@statewalker/platform-api`](packages/platform-api) | Type-only intent vocabulary: pickers, downloads, clipboard, preferences, URL state. |
| [`@statewalker/platform-browser`](packages/platform-browser) | Browser implementation of the platform-api intents. |

### Substrate fragments — workspace foundation

| Package | Description |
| --- | --- |
| [`@statewalker/workspace`](packages/workspace) | Workspace logic fragment: the `Workspace` class, system/secrets/settings adapters, the `workspace:change` intent and its registrar init. |
| [`@statewalker/workspace-bridge`](packages/workspace-bridge) | Workspace-bridge logic fragment: `WorkspaceShellAdapter` + `workspace:*` intents. |
| [`@statewalker/workspace-bridge-react`](packages/workspace-bridge-react) | Workspace-bridge renderer: `AppWorkspaceProvider`, `DirectoryPickerEmptyState`, `ReconnectBanner`, switch-workspace header item. |

### Substrate fragments — shell substrate

| Package | Description |
| --- | --- |
| [`@statewalker/core-react`](packages/core-react) | React mount, `<AppRoot>`, `core:views` slot, substrate hooks (`useSlot`, `useKeyedSlot`, `useAdapterValue`, `useAdapter`), theme binding. |
| [`@statewalker/shadcn-react`](packages/shadcn-react) | shadcn/ui primitives + `cn()` helper for the workbench substrate. |
| [`@statewalker/dock`](packages/dock) | Dock logic fragment: `dock:*` slot keys, `dock:show-panel`/`close-panel`/`focus-panel` intents, dock state. |
| [`@statewalker/dock-react`](packages/dock-react) | Dock renderer: `dockview-react` host, `MainShell`, `ShellHeader`, `JsonPanel`. |
| [`@statewalker/files`](packages/files) | Files logic fragment: file-op intents, `files:*` slots, `MimeRenderer` + `pickMimeRenderer`, `FilesManager`. |
| [`@statewalker/file-explorer`](packages/file-explorer) | File-explorer logic fragment: navigation, search controller, tree-state, browser orchestration intents. |
| [`@statewalker/file-explorer-react`](packages/file-explorer-react) | File-explorer renderer: tree, list, drag-and-drop, context menu, navigation breadcrumbs, search panel. |
| [`@statewalker/settings`](packages/settings) | Settings logic fragment: `settings:*` slots and intents. |
| [`@statewalker/settings-react`](packages/settings-react) | Settings renderer: settings dialog and `dock:header-items` button. |
| [`@statewalker/inline-content`](packages/inline-content) | Inline-content logic fragment: `inline-content:components` descriptor slot + descriptor types. |
| [`@statewalker/inline-content-react`](packages/inline-content-react) | Inline-content renderer fragment: `inline-content:renderers` slot, `<InlineContent>`, built-in components. |
| [`@statewalker/catalog-registry`](packages/catalog-registry) | Catalog-registry logic fragment: `json:catalogs` slot key + `newCatalogRegistry(workspace)` helper. |
| [`@statewalker/catalog-registry-react`](packages/catalog-registry-react) | Catalog-registry renderer: `useCatalogRegistry()` React hook. |
| [`@statewalker/spec-store`](packages/spec-store) | Spec-store logic fragment: `SpecStore` adapter + `spec:create`/`spec:patch` intents + `restorePanelSpecsFromLayout` helper. |

### Substrate fragments — per-MIME viewers

| Package | Description |
| --- | --- |
| [`@statewalker/image-viewer-react`](packages/image-viewer-react) | Per-MIME viewer renderer: contributes a `MimeRenderer` to `files:mime-renderers`. |
| [`@statewalker/markdown-viewer-react`](packages/markdown-viewer-react) | Markdown viewer renderer fragment. |
| [`@statewalker/pdf-viewer-react`](packages/pdf-viewer-react) | PDF viewer renderer fragment. |
| [`@statewalker/video-viewer-react`](packages/video-viewer-react) | Video viewer renderer fragment. |

## Backbone independence rule

The `backbone-*` packages MUST NOT declare a runtime dependency on any other `@statewalker/*` package — including siblings in this monorepo. Backbone vendors the narrow slices it needs (currently `Logger`/`getLogger` from `@statewalker/shared-logger`) into `backbone-common/src/_vendor/`. A CI check (`scripts/check-backbone-isolation.ts`) enforces this invariant on every PR.

Substrate fragments may depend on backbone, never the reverse.

## Substrate fragment shape

Every substrate fragment package follows a single canonical layout, enforced by the `workbench-canonical-substrate` capability spec:

```
src/
  index.ts          # re-exports public/index.js
  fragment.ts       # re-exports public/init.js's default
  public/           # types, intents, slot keys, manager classes, init
  internal/         # impl + tests; not reachable through any export sub-path
  styles.css        # renderer fragments only — Tailwind v4 @source globs
```

`package.json#exports` declares exactly `"."` and `"./fragment"` for logic fragments, plus `"./styles"` for renderer fragments (`*-react`). Logic fragments do not import React or any `*-react` package.

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
