# @statewalker/workbench-views

Framework-agnostic view models for the statewalker workbench. Each `XxxView` / `XxxModel` is an observable (extends `BaseClass`) and exposes a typed adapter (`getXxxView(ctx)`) so any fragment can read or mutate it without coupling.

## Why it exists

Renderers come and go (HTML / React / shadcn / Spectrum), but the underlying state — the active panel, the dock tree, the URL ↔ state mapping, the theme mode, dialog stacks, registries — is the same in every host. This package owns those view models in a single place so that:

- Renderers stay thin: they read view properties and call view methods, never the other way round.
- Cross-fragment communication happens by subscribing to view `onUpdate`, not by coordinating renderers directly.
- The same view model is shared by an HTML and a React rendering of the same panel.

## Installation

```sh
pnpm add @statewalker/workbench-views
```

## Usage

```ts
import { getThemeView, getPanelManagerView, publishPanel, DockPanelView } from "@statewalker/workbench-views";

const theme = getThemeView(ctx);
theme.setMode("dark");

publishPanel(ctx, new DockPanelView({
  key: "files",
  label: "Files",
  area: "left",
  content: someContentView,
}));

getPanelManagerView(ctx).onUpdate(() => render(getPanelManagerView(ctx).getTree()));
```

## Default export — `initShellCore`

The package's default export is `initShellCore(ctx)`, the shell-bootstrap hook that bridges `publishPanel` extension points into `PanelManagerView`. Listing `@statewalker/workbench-views` as a manifest root activates it automatically:

```ts
const manifest: AppManifest = {
  roots: ["@statewalker/workbench-views", "@statewalker/platform-browser", ...],
};
```

## Internals

- **Sub-paths** — `actions`, `collections`, `color`, `content`, `core`, `data`, `date-time`, `dock`, `feedback`, `forms`, `layout`, `menus`, `navigation`, `overlays`, `shell`. The package's `exports` map exposes each as a sub-import (`@statewalker/workbench-views/dock`, etc.) plus the bundled root export.
- **Observability** — every view extends `BaseClass` from `@statewalker/shared-baseclass`; subscribe via `view.onUpdate(fn)`.
- **Adapters** — every view registers a context-bound `getXxxView(ctx)` factory via `@statewalker/shared-adapters` so consumers never hold instances directly.

## Related

- [`@statewalker/workbench-dom`](../workbench-dom) — DOM bindings (theme, pointer, keyboard, HTML component registry).
- [`@statewalker/workbench-react`](../workbench-react) — React hooks and component registry for these views.
- [`@statewalker/workbench-react-shadcn`](../workbench-react-shadcn) / [`@statewalker/workbench-react-spectrum`](../workbench-react-spectrum) — concrete React renderers.
- [`@statewalker/platform-api`](../platform-api) — `UrlStateView` and the platform intent vocabulary.

## License

MIT — see the monorepo root `LICENSE`.
