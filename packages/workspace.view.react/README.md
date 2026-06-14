# @statewalker/workspace.view.react

React renderer fragment for the workspace bridge: the full-screen directory
picker / onboarding view (`DirectoryPickerEmptyState`) and the two header items
(workspace label + switch-workspace button) that read
`@statewalker/workspace.browser`'s
`WorkspaceShellAdapter` and drive its commands.

## What it is

This is the `.view.react` aspect of the workspace family — the rendering layer
over the React-free logic in `workspace.core` and
the browser platform impl in `workspace.browser`.
It contains React components only; all state lives in the
`WorkspaceShellAdapter`, and every user action is dispatched as a command
(`workspace:change`, `workspace:reconnect`, `workspace:disconnect`). The
components read state with `useAdapterValue(WorkspaceShellAdapter, …)` and never
touch the File System Access API directly.

It exposes two surfaces:

- **`DirectoryPickerEmptyState`** — the only component exported from the package
  root, for a host's `<App/>` to render when the workspace is not yet `ready`.
- **A default fragment-init** (`./fragment`) that registers the workspace label
  and switch-workspace header views into the shell's slots.

## Why it exists

The ADR-0002 logic/view split is non-negotiable: `workspace.browser` holds the
React-free state machine and commands, and the React that renders it must live
in a separate package. This package is that renderer. It lets the host present
a complete workspace-onboarding experience — pick a folder, reconnect after a
reload, switch folders from the header — without the host knowing anything about
File System Access permissions or IndexedDB; it just mounts a component and the
adapter/command plumbing does the rest.

## How to use

```sh
pnpm add @statewalker/workspace.view.react
```

The package has three entry points:

| Import | Provides |
| --- | --- |
| `@statewalker/workspace.view.react` | `DirectoryPickerEmptyState` |
| `@statewalker/workspace.view.react/fragment` | default `init(ctx)` registering the header views |
| `@statewalker/workspace.view.react/styles` | Tailwind v4 `@source` globs for class discovery |

A host imports the styles once at boot, mounts the empty-state when the
workspace is not `ready`, and runs the fragment-init to contribute the header
items:

```tsx
import "@statewalker/workspace.view.react/styles";
import initWorkspaceView from "@statewalker/workspace.view.react/fragment";
import { DirectoryPickerEmptyState } from "@statewalker/workspace.view.react";
import { useAdapterValue } from "@statewalker/ui.view.react";
import { WorkspaceShellAdapter } from "@statewalker/workspace.browser";

// during fragment loading:
const cleanup = initWorkspaceView(ctx);

// inside <App/>:
function App() {
  const state = useAdapterValue(WorkspaceShellAdapter, (a) => a.getState());
  if (state.status !== "ready") return <DirectoryPickerEmptyState />;
  return <Workbench />;
}
```

> **Note.** `<AppWorkspaceProvider/>` — the React context that bridges a
> `Workspace` into the tree and backs `useAdapter` / `useAdapterValue` — lives in
> `@statewalker/ui.view.react`, **not** here.
> Mount it above any of these components.

## Examples

### Onboarding / empty-state view

`DirectoryPickerEmptyState` is a single component covering all four non-`ready`
statuses of `WorkspaceShellAdapter`:

```tsx
import { DirectoryPickerEmptyState } from "@statewalker/workspace.view.react";

// loading          → disabled "Open folder" while silent-restore runs
// unsupported       → explanatory copy instead of the picker button
// empty             → "Open folder" picker (fires workspace:change)
// needs-permission → "Reconnect <label>" + "Pick a different folder"
<DirectoryPickerEmptyState />
```

It pulls `Commands` and `WorkspaceShellAdapter` from context, calls
`ChangeWorkspaceCommand` / `WorkspaceReconnectCommand`, swallows the
`AbortError` a user-cancelled picker throws, and surfaces any other error inline.

### Header items via the fragment-init

The default export registers two views into `core:views` and contributes the
label into `dock:header-items`:

```ts
import initWorkspaceView from "@statewalker/workspace.view.react/fragment";

const cleanup = initWorkspaceView(ctx);
// registers:
//   "workspace:label-header"  → WorkspaceLabelHeader  (dock leading, order 0)
//   "workspace:switch-button" → SwitchWorkspaceButton (view only)
await cleanup(); // unregisters both on teardown
```

- **`WorkspaceLabelHeader`** renders `Chat Mini / <label>`, tracking the adapter
  so the label updates on switch/reconnect with no prop wiring.
- **`SwitchWorkspaceButton`** fires `workspace:disconnect` (tear down + clear
  IndexedDB) then `workspace:change` (re-pick). Registered as a view so the
  canonical shell can compose it into the System menu rather than the header bar.

## Internals

### Architectural decisions

- **State in the adapter, never in React.** Components are pure projections of
  `WorkspaceShellAdapter.getState()`; the only local React state is the inline
  error string in the empty-state. This keeps the renderer swappable and the
  logic testable without a DOM.
- **Actions are commands, not callbacks.** Every button calls
  `commands.call(SomeCommand, …).promise`. The renderer holds no references to
  managers or the browser APIs — it only knows command tokens from
  `workspace.browser`.
- **Slot registration, not direct mounting, for header items.** The fragment
  registers `WorkspaceLabelHeader` / `SwitchWorkspaceButton` into the
  `coreViewsSlot` and contributes the label to `dockHeaderItemsSlot` (per
  ADR 0002). `DirectoryPickerEmptyState` is *not* slot-registered — `<App/>`
  imports and mounts it directly because it is a full-screen route, not a slot
  contribution.
- **Single component for four statuses.** Rather than four onboarding views,
  `DirectoryPickerEmptyState` branches on `status` internally — the copy and
  buttons differ but the card chrome is shared.

### Constraints

- **Renderer-only.** No File System Access, IndexedDB, or permission logic lives
  here — all of that is in `workspace.browser`.
- **Requires a workspace in context.** All components rely on
  `useAdapter`/`useAdapterValue`, which need an `<AppWorkspaceProvider/>`
  ancestor from `@statewalker/ui.view.react`.
- **`ReconnectBanner` is internal.** A compact `needs-permission` banner exists
  in `src/internal` but is **not** exported from the package root; the
  reconnect affordance is currently surfaced through `DirectoryPickerEmptyState`.
  (The `package.json` description still lists it and `AppWorkspaceProvider` for
  historical reasons.)
- **Tailwind v4 + shadcn.** Components use shadcn primitives and Tailwind
  utility classes; the host must import `/styles` so Tailwind's `@source` walk
  emits the classes used here into the host bundle.

### Dependencies

- `@statewalker/workspace.browser` — the
  `WorkspaceShellAdapter`, `ChangeWorkspaceCommand`,
  `WorkspaceReconnectCommand`, `WorkspaceDisconnectCommand` the views read and fire.
- `@statewalker/workspace.core` — `getWorkspace`
  used by the fragment-init.
- `@statewalker/ui.view.react` — `useAdapter` / `useAdapterValue` hooks,
  `coreViewsSlot`, the `ViewComponent` type (and `AppWorkspaceProvider`, mounted
  by the host).
- `@statewalker/ui.view.shadcn` — `Button`, `Card*` primitives.
- `@statewalker/shell.core` — `dockHeaderItemsSlot` the label is contributed to.
- `@statewalker/shared-slots` — the `Slots` adapter for view/header registration.
- `@statewalker/shared-commands` — the `Commands` adapter.
- `@statewalker/shared-registry` — `newRegistry` for grouped cleanup.
- `lucide-react` — `FolderOpen`, `RefreshCw`, `LogOut` icons.
- `react` / `react-dom` — peer dependencies (`>=18`).

## Related

- `@statewalker/workspace.browser` — the
  browser state machine and commands these components render.
- `@statewalker/workspace.core` — the React-free
  workspace logic at the base of the family.

## License

MIT — see the monorepo root `LICENSE`.
