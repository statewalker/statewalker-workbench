# statewalker-workbench

Application shell and fragment platform for the statewalker ecosystem — backbone runtimes and view/dom/react renderers.

## Packages

| Package | Description |
| --- | --- |
| [`@statewalker/backbone-common`](packages/backbone-common) | Backbone primitives: resolver, topo sort, activation, manifest types, vendored logger. |
| [`@statewalker/backbone-server`](packages/backbone-server) | Node bootstrap: resolves `AppManifest` against the filesystem and activates modules. |
| [`@statewalker/backbone-web`](packages/backbone-web) | Browser runtime: fragment loader + web-side module activation. |
| [`@statewalker/shared-views`](packages/shared-views) | Framework-agnostic observable view/model primitives. |
| [`@statewalker/shared-dom`](packages/shared-dom) | DOM bindings (pointer, keyboard, theme, URL state) + HTML component registry. |
| [`@statewalker/shared-react`](packages/shared-react) | React renderers, view-to-hook bridges, layout primitives. |
| [`@statewalker/shared-react-shadcn`](packages/shared-react-shadcn) | shadcn/ui design-system renderer set. |
| [`@statewalker/shared-react-spectrum`](packages/shared-react-spectrum) | Adobe Spectrum design-system renderer set. |

## Backbone independence rule

The `backbone-*` packages MUST NOT declare a runtime dependency on any other `@statewalker/*` package — including siblings in this monorepo. Backbone vendors the narrow slices it needs (currently `Logger`/`getLogger` from `@statewalker/shared-logger`) into `backbone-common/src/_vendor/`. A CI check (`scripts/check-backbone-isolation.ts`) enforces this invariant on every PR.

Views / DOM / React may depend on backbone, never the reverse.

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
