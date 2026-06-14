# @statewalker/shell.view.react

## What it is

The React renderer for the workbench application shell — the visual half of the dock. It turns the React-free contract in `@statewalker/shell.core` into a concrete UI: `MainShell` (header + resizable side panels + central tabbed dock), `DockViewHost` (the [`dockview-react`](https://dockview.dev/) mount that binds the live api to `DockHost`), `ShellHeader`, the single `"json"` panel that renders specs from `render.core`, the shadcn-styled `LineTab`, and the `dock:tab-icons` slot. It registers `MainShell` as the application root view so the substrate (`ui.view.react`) renders the shell without importing it.

## Why it exists

Per ADR 0002, the shell's React tree is a separate package from its logic so that the value carried across the boundary stays declarative. `shell.core` defines `dock:*` commands and slots whose `viewKey` fields are plain strings; this package resolves those keys to React components, owns the `DockviewApi` binding, and supplies the only DockView component kind. The split keeps the `ui.view.react → shell.view.react` edge one-way: the substrate renders whatever sits under `SHELL_ROOT_VIEW_KEY`, and this fragment is what registers `MainShell` there.

## How to use

```sh
pnpm add @statewalker/shell.view.react
```

The package is a renderer fragment. Its default export (`@statewalker/shell.view.react/fragment`) is an `init(ctx)` that registers `MainShell` into the `core:views` slot under `SHELL_ROOT_VIEW_KEY`. The host app activates it after the logic fragments and imports its stylesheet once at boot:

```ts
import "@statewalker/shell.view.react/styles";
```

Mounting `MainShell` is also what binds the DockView api to the dock — its `<DockViewHost>` calls `DockHost.setApi` on `onReady`, draining any queued `dock:show-panel` calls.

## Examples

### Activating the fragment

```ts
import initShell from "@statewalker/shell.view.react/fragment";

// During renderer-fragment boot, after ui.view.react and shell.core:
const cleanup = initShell(ctx); // registers MainShell under SHELL_ROOT_VIEW_KEY
// ... on teardown:
cleanup();
```

Once active and the workspace shell reaches `ready`, the substrate's `<App/>` renders `MainShell` automatically.

### Rendering the host directly (e.g. in a test harness)

```tsx
import { DockViewHost } from "@statewalker/shell.view.react";

function Harness({ workspace }) {
  return <DockViewHost workspace={workspace} />;
}
```

`DockViewHost` takes the `Workspace` as a prop so it can render anywhere an instance is in scope; the panels it renders read the workspace via `useAppWorkspace()` (React context survives dockview's portal rendering).

### Contributing a per-prefix tab icon

```tsx
import { Slots } from "@statewalker/shared-slots";
import { dockTabIconSlot } from "@statewalker/shell.view.react";
import { FileText } from "lucide-react";

const slots = workspace.requireAdapter(Slots);
slots.provide(dockTabIconSlot, {
  panelIdPrefix: "file:",        // trailing colon by convention
  Icon: FileText,                // any component accepting { className }
});
```

`LineTab` picks the contribution whose `panelIdPrefix` the panel id starts with (longest prefix wins) and renders it next to the tab title.

## Internals

### Architectural decisions

- **One DockView component kind: `"json"`.** `DockViewHost` registers exactly `{ json: JsonPanel }`. Every panel — whatever its content — flows through `JsonPanel`, which resolves a `SpecRecord` from `render.core`'s `SpecStore` by `specId`, resolves the catalog from the `catalogs` slot, and renders `<SpecRenderer>` (the single boundary into json-render). Adding panel kinds is done with new specs/catalogs, not new components.
- **MainShell registered, never imported.** The substrate (`ui.view.react`) does not import the shell; this fragment registers `MainShell` under `SHELL_ROOT_VIEW_KEY` in `core:views`. The dependency edge is one-way (`shell → ui`).
- **Declarative chrome from slots.** `MainShell` composes itself from `shell.core`'s three slots — `dock:side-panels` (left/right `ResizablePanel`s around the central host), `dock:header-items` (leading/trailing cells in `ShellHeader`), `dock:overlays` (non-layout mounts). Each contribution's `viewKey` is resolved against `core:views` at render time; an unresolved key renders nothing.
- **Close via command, not `api.close()`.** `LineTab`'s close button and `JsonPanel`'s recovery placeholders dispatch `ClosePanelCommand` rather than calling DockView directly, so the dock's spec-eviction pass runs.

### Algorithms

- **Api binding & teardown.** `DockViewHost` captures `event.api` in `onReady` → `DockHost.setApi`, and `DockHost.detach()` on unmount. The host snapshots layout on detach so StrictMode/HMR remounts don't drop panels.
- **Reactive tab title/active state.** `LineTab` subscribes via `useSyncExternalStore` to `api.onDidTitleChange` / `api.onDidActiveChange`; `JsonPanel` subscribes to `SpecStore.observe(specId)` so a panel re-renders when its spec changes or disappears.
- **Longest-prefix icon match.** `LineTab` scans `dock:tab-icons`, keeping the entry with the longest `panelIdPrefix` that the panel id starts with, so a specific prefix (`"chat:agent:"`) overrides a broad one (`"chat:"`).

### Constraints

- The shell renders only once the workspace shell status is `ready`; before that the substrate shows the directory-picker empty state.
- `JsonPanel` shows a self-contained recovery placeholder (with a close button) when the spec or its catalog is missing rather than throwing.
- React-only: contributions to `dock:tab-icons` carry components, so that slot lives here rather than in `shell.core` (which must stay React-free).

### Dependencies

- `dockview-react` (pinned `6.0.3`) — the dock host, panel api, and tab header types.
- `@statewalker/shell.core` — the `dock:*` commands, the three chrome slots, and the `DockHost` adapter this renderer drives.
- `@statewalker/ui.view.react` — `SHELL_ROOT_VIEW_KEY`, `coreViewsSlot`, and the hooks (`useAdapter`, `useSlot`, `useKeyedSlot`, `useAppWorkspace`, `compareByOrderAndId`).
- `@statewalker/ui.view.shadcn` — `ResizablePanel*` for the side-panel layout and `cn()` for `LineTab` styling.
- `@statewalker/render.core` + `@statewalker/render.view.react` — `SpecStore`, the catalogs slot, and `SpecRenderer` for `JsonPanel`.
- `@statewalker/workspace.view.react` — re-used renderer surfaces from the workspace fragment.
- `lucide-react` — the tab close (`X`) icon.

## Related

- `@statewalker/shell.core` — the logic half: `dock:*` commands, slots, and the `DockHost` adapter.
- `@statewalker/ui.view.react` — the substrate that renders this shell under `SHELL_ROOT_VIEW_KEY`.
- `@statewalker/ui.view.shadcn` — the resizable-panel and styling primitives used here.
- `@statewalker/render.view.react` — `SpecRenderer`, the json-render boundary `JsonPanel` uses.

## License

MIT — see the monorepo root `LICENSE`.
