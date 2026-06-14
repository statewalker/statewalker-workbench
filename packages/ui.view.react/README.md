# @statewalker/ui.view.react

## What it is

The React substrate of the workbench: the package that owns the application mount path and the React-side primitives every other renderer fragment builds on. It provides the boot `init` that calls `createRoot(...).render(<AppRoot/>)`, the `<App/>` root-surface switch, the `core:views` keyed slot (`SHELL_ROOT_VIEW_KEY`), the substrate stylesheet (CSS variables, dark variant, Tailwind v4 content discovery), and the canonical React hooks for reading the `Workspace`, its adapters, and its slots — `useAppWorkspace`, `useAdapter`, `useAdapterValue`, `useSlot`, `useKeyedSlot`, plus the `compareByOrderAndId` ordering helper.

## Why it exists

The workbench is a set of fragments wired through a `Workspace` (commands, slots, adapters). Those fragments need one agreed way to enter React and one agreed way to read workspace state from inside a component. This package is that single substrate: it mounts the React tree exactly once, exposes the `core:views` slot through which fragments register their components by string key (so no fragment imports another's React tree), and centralises the `Workspace`-into-React glue. It is a renderer-only package — its logic counterpart is the React-free `workspace.core` — and it deliberately holds no application UI of its own, only the frame and the hooks.

## How to use

```sh
pnpm add @statewalker/ui.view.react
```

Activate the fragment (default export at `@statewalker/ui.view.react/fragment`) during boot, after the workspace and logic fragments are set up. It reads the boot `Workspace` and React Query client from `ctx`, then mounts `<AppRoot/>` into `#app`. Import the stylesheet once at boot:

```ts
import "@statewalker/ui.view.react/styles";
```

Inside any view component, use the hooks instead of reaching for the workspace directly:

```tsx
import { useAdapter, useAdapterValue, useSlot } from "@statewalker/ui.view.react";
import { Commands } from "@statewalker/shared-commands";

function MyView() {
  const commands = useAdapter(Commands);
  const isReady = useAdapterValue(SomeAdapter, (a) => a.ready);
  const items = useSlot(slots, mySlot);
  // ...
}
```

## Examples

### Registering a component into the shell

```ts
import { Slots } from "@statewalker/shared-slots";
import { coreViewsSlot, type ViewComponent } from "@statewalker/ui.view.react";
import { MyPanel } from "./my-panel.js";

const slots = workspace.requireAdapter(Slots);
slots.register(coreViewsSlot, "myfragment:panel", MyPanel as ViewComponent);
```

Other fragments reference `"myfragment:panel"` as data (e.g. a slot `viewKey`) and resolve it to the component at render time via `useKeyedSlot(slots, coreViewsSlot).get(...)`. ViewKey convention: `<owning-logic-fragment-id>:<purpose>`.

### Reading an adapter reactively

```tsx
import { useAdapterValue } from "@statewalker/ui.view.react";
import { WorkspaceShellAdapter } from "@statewalker/workspace.browser";

function StatusBadge() {
  // Pass a primitive/stable selector so Object.is snapshot equality bails out.
  const status = useAdapterValue(WorkspaceShellAdapter, (a) => a.getState().status);
  return <span>{status}</span>;
}
```

`useAdapterValue` subscribes through the adapter's `onUpdate` and re-renders on each notify. `useAdapter` is the non-reactive form (just `requireAdapter` with a nicer call site).

### Subscribing to slots

```tsx
import { useAdapter, useSlot, useKeyedSlot, compareByOrderAndId } from "@statewalker/ui.view.react";
import { Slots } from "@statewalker/shared-slots";

function Toolbar() {
  const slots = useAdapter(Slots);
  const views = useKeyedSlot(slots, coreViewsSlot);     // { get(id), entries }
  const actions = [...useSlot(slots, actionsSlot)].sort(compareByOrderAndId);
  return <>{actions.map((a) => { const C = views.get(a.viewKey); return C ? <C key={a.id} /> : null; })}</>;
}
```

`useSlot` returns a reference-stable readonly array; `useKeyedSlot` returns a `KeyedSlotView` with O(1) `get(id)` and a reference-stable `entries` map.

## Internals

### Architectural decisions

- **Single mount, single owner.** The fragment's `init` is the only place `createRoot().render()` runs; cleanup unmounts so re-entrant load/unload cycles don't leak DOM.
- **`core:views` indirection.** Fragments register components by string key rather than importing each other. `<App/>` renders whatever sits under `SHELL_ROOT_VIEW_KEY` (the shell fragment registers `MainShell` there), keeping the `ui → shell` edge one-way and the substrate ignorant of the shell.
- **Two top-level surfaces.** `<App/>` reads `WorkspaceShellAdapter` via `useAdapterValue`: any non-`ready` status (`loading | unsupported | empty | needs-permission`) renders `<DirectoryPickerEmptyState>` from `workspace.view.react`; only `ready` reveals the registered shell.
- **Hooks as the canonical contract.** `useAppWorkspace` + `useAdapter` are the single way renderer fragments reach the workspace and its adapters; `useAdapterValue` adds reactivity over `BaseClass`-style `onUpdate`. Centralising the indirection means future concerns (error boundaries on missing adapters) live in one place.

### Algorithms

- **Snapshot stability.** All three subscription hooks use `useSyncExternalStore`. `useSlot`/`useKeyedSlot` rely on the `Slots` bus returning reference-stable snapshots so the store does not loop; `useKeyedSlot` memoises its `{ get, entries }` view on `[slots, decl, entries]`.
- **Ordering.** `compareByOrderAndId` sorts by `order` (default `100`), ties broken lexicographically by `id` — shared across slot consumers so default ordering is uniform.
- **Lazy query client.** `getQueryClient(ctx)` returns the boot-provided `QueryClient` under `core-views:query-client`, or lazily constructs one (`retry: false`, `refetchOnWindowFocus: false`) for isolated `<App/>` tests.

### Constraints

- `useAppWorkspace()` throws outside `<AppWorkspaceProvider>` (the provider is mounted by `AppRoot`). The `Workspace` itself is created in the host's boot script before React mounts; the provider only carries it into the tree.
- `useAdapterValue` selectors should return primitives or stable references — selectors that materialise a fresh array/object every call cause spurious re-renders.
- React-only renderer package; it holds no application UI, only the frame, the slot, and the hooks.

### Dependencies

- `@statewalker/shared-slots` — `defineKeyedSlot` / `Slots` for `core:views` and the slot hooks.
- `@statewalker/shared-baseclass` — the `onUpdate` shape `useAdapterValue` subscribes to (consumed structurally as `ObservableAdapter`).
- `@statewalker/shared-commands`, `@statewalker/shared-registry` — command/registry surfaces used by consumers via the hooks.
- `@statewalker/workspace.core` / `.browser` / `.view.react` — the `Workspace` type and adapter contracts, `WorkspaceShellAdapter`, and the `DirectoryPickerEmptyState` empty-state surface.
- `@tanstack/react-query` — the app-wide `QueryClient` wired into `<AppRoot/>`.

## Related

- `@statewalker/ui.view.shadcn` — the shadcn primitive library this substrate's CSS variables theme.
- `@statewalker/shell.view.react` — registers `MainShell` under `SHELL_ROOT_VIEW_KEY` and is rendered by `<App/>`.
- `@statewalker/workspace.core` — the React-free workspace this package mounts into React.
- `@statewalker/workspace.view.react` — source of `DirectoryPickerEmptyState`.

## License

MIT — see the monorepo root `LICENSE`.
