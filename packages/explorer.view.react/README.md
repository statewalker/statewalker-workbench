# @statewalker/explorer.view.react

## What it is

The React renderer for the workbench file explorer. It binds the
`file-explorer` json-render catalog, renders the panel UI
(`FileExplorerPanel`, `FilesListView`, plus internal breadcrumb / file-row /
drag-and-drop), applies the two-pane panel presets into the dock on workspace
open, and serves the `file-explorer:new-panel` command. It is the view half of
`@statewalker/explorer.core`, which owns all the
React-free logic.

## Why it exists

Per ADR-0002 the explorer is split into a logic fragment and a renderer
fragment. This package is the renderer: it consumes the models, controller, spec
helpers, and slots from `explorer.core` and turns them into mounted dock panels.
It also holds the schema-typed json-render catalog (`fileExplorerCatalog`),
which must live on the React side because it needs `@json-render/react`'s
`schema` (reached through `@statewalker/render.view.react`, the sole
json-render/react boundary).

## How to use

```sh
pnpm add @statewalker/explorer.view.react
```

Three entry points:

- `@statewalker/explorer.view.react` — public React surface
  (`FileExplorerPanel`, `FileExplorerPanelProps`, `FilesListView`).
- `@statewalker/explorer.view.react/fragment` — default-exported
  `initFileExplorerReact(ctx)` renderer-fragment init.
- `@statewalker/explorer.view.react/styles` — the bundled `styles.css`.

The host app registers the fragment init and imports the styles. The init wires
the catalog, the dock-tab icon, the two-pane preset applier, and the new-panel
command; it returns a `cleanup` thunk. Peer-depends on `react` / `react-dom` >= 18.

## Examples

Register the fragment (host wiring) — pairs with the logic fragment:

```ts
import initFileExplorer from "@statewalker/explorer.core/fragment";
import initFileExplorerReact from "@statewalker/explorer.view.react/fragment";
import "@statewalker/explorer.view.react/styles";

const cleanupLogic = initFileExplorer(ctx);
const cleanupView = await initFileExplorerReact(ctx);
```

Mount a single panel directly (outside the dock):

```tsx
import { FileExplorerPanel } from "@statewalker/explorer.view.react";

<FileExplorerPanel
  panelId="left"
  initialPath="/"
  label="Files"
  folderNavigationHost
/>;
```

The catalog binding means a dock tab built from `makeFileExplorerSpec(panelId)`
(in `explorer.core`) resolves to `FileExplorerView`, which renders a
`FileExplorerPanel`.

## Internals

### Architectural decisions

- **Catalog binding is the integration seam.** `init.tsx` calls `defineRegistry`
  against `fileExplorerCatalog` and registers it under
  `FILE_EXPLORER_CATALOG_ID` in `catalogsSlot`, so any spec produced by
  `makeFileExplorerSpec` renders a `FileExplorerPanel`.
- **Panels are ordinary dock tabs.** Two-pane presets are applied by dispatching
  one `dock:show-panel` (`ShowDockPanelCommand`) per preset, so explorer panels
  appear in the central `DockViewHost` exactly like markdown / pdf / image
  viewers. A preset's `side` becomes a dock-position hint (`left` / `right` split,
  else `within`); the first preset opens at the default position.
- **Spec pre-allocation avoids a flash.** `restorePanelSpecsFromLayout` runs
  synchronously at init so every persisted `file-explorer:` panel id has a spec
  before `DockView.fromJSON()` runs, preventing a `PanelMissing` placeholder.
  When a preset later arrives, an existing pre-allocated spec is `patch`ed up to
  the full preset (label, host flags) rather than left at restore defaults.
- **Each panel owns its `PanelController`** (`useMemo` keyed on workspace /
  panelId / label / initialPath) and registers an `ActiveFileExplorerPanel` into
  `activeFileExplorerPanelsSlot` so the logic-side `files:open` handler can route
  navigations to it. Every click / keypress dispatches `files:open` with the
  panel id as both `origin` and `target`, so folders navigate in place.
- **`useViewModel`** wraps `useSyncExternalStore` over a `ViewModel`'s
  `onUpdate` / `version`, the bridge between the React-free reactive models and
  the React render loop.

### Algorithms

- **Preset idempotency:** an `opened` set tracks already-mounted preset ids so
  hot-added presets (observed via `slots.observe`) don't duplicate tabs;
  `workspace.onUnload` clears it. `workspace.onLoad` fires immediately if already
  open, so one subscription covers first-load and re-open.
- **`file-explorer:new-panel`** generates a fresh `panel-<uuid8>` id, creates a
  persistent spec, shows the dock panel (default position `within`), and resolves
  with the new id.

### Constraints

- Peer-depends on React 18+; `styles.css` must be imported by the host.
- Folder single-click navigates; files require double-click / Enter (so they stay
  draggable).

### Dependencies

`@statewalker/explorer.core` (models, controller, commands, slots, spec
helpers), `@statewalker/render.core` (`SpecStore`, `catalogsSlot`, layout
restore), `@statewalker/render.view.react` (`schema`, `defineRegistry`),
`@statewalker/shell.core` (`ShowDockPanelCommand`, `FocusPanelCommand`,
`PanelPosition`), `@statewalker/shell.view.react` (`dockTabIconSlot`),
`@statewalker/ui.view.react` (`useAdapter`, `useAppWorkspace`,
`compareByOrderAndId`), `@statewalker/ui.view.shadcn`, `mime.core`
(`OpenCommand`), `workspace.core` (`getWorkspace`), `shared-commands`,
`shared-registry`, `shared-slots`, `@json-render/core`, `zod`, `lucide-react`.

## Related

- `@statewalker/explorer.core` — the paired
  React-free logic fragment (the `.core` ↔ `.view.react` pair).
- `@statewalker/render.view.react` — the
  json-render/react boundary supplying `schema` / `defineRegistry`.
- `@statewalker/shell.view.react` — dock host
  and tab-icon slot.

## License

MIT — see the monorepo root `LICENSE`.
