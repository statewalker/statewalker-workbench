# @statewalker/settings.view.react

## What it is

The React renderer fragment for the workbench settings dialog. It provides
two components — `SettingsButton` (a header trigger that fires
`settings:open`) and `SettingsDialog` (the modal shell with a tab sidebar) —
registers both into the `core:views` view registry, and contributes the
dialog to the shell's `dock:overlays` slot. It renders the state and tabs
owned by `@statewalker/settings.core`.

## Why it exists

This is the `.view.react` half of the ADR-0002 split: `settings.core` holds
the dialog state, commands, and the `settings:tabs` contribution slot with
no React; this package is the rendering surface. The dialog is a layout
shell only — each tab's UI belongs to the fragment that contributed it
(resolved via `ViewRegistry.get(tab.viewKey)`), so this package stays thin
and unaware of any particular tab's content.

## How to use

```sh
pnpm add @statewalker/settings.view.react
```

Import the styles once at the host app boot (Tailwind v4 content discovery),
then activate the fragment after `settings.core` and the shell:

```ts
import "@statewalker/settings.view.react/styles";
import initSettingsReact from "@statewalker/settings.view.react/fragment";

const cleanup = initSettingsReact(ctx);
// ... later
await cleanup();
```

The fragment registers:

- `SettingsButton` into `core:views` under `settings:button`
- `SettingsDialog` into `core:views` under `settings:dialog`
- the dialog into `dock:overlays` (so it mounts once at the top of the tree)

The package exposes **no public React components** — they are reached
through `ViewRegistry` / the overlays slot, not imported directly.

## Examples

### Opening settings from a header item

The canonical app shell composes Settings into the System menu rather than
pinning a top-level button, but the standalone `SettingsButton` view is
registered for callers that still want a direct trigger. It simply fires
the command from `settings.core`:

```tsx
// internal — fires OpenSettingsCommand via the Commands adapter
<Button onClick={() => commands.call(OpenSettingsCommand, { tabId })}>
  Settings
</Button>
```

### How the dialog resolves tabs

`SettingsDialog` reads `Settings.isOpen` / `activeTabId`, the
`settings:tabs` slot (sorted by `order` then `id`), and renders each active
tab's content via `ViewRegistry.get(tab.viewKey)`:

```
Settings adapter ──┐
settings:tabs slot ┼─→ <SettingsDialog>  ─→ <nav> tab list
core:views registry┘                      └→ ViewRegistry.get(viewKey) → <TabContent>
```

If a tab is registered but no component is bound to its `viewKey`, the
dialog renders an inline placeholder noting the missing binding.

## Internals

### Architectural decisions

- **Slot/registry-mediated, no public exports.** Components are contributed
  to `core:views` and `dock:overlays`, never exported, so the host composes
  them through the shell rather than importing concrete React.
- **Thin layout shell.** `SettingsDialog` owns only the modal frame and the
  tab sidebar; tab content is owned by contributing fragments via
  `viewKey`.
- **Stable snapshots.** `isOpen` and `activeTabId` are read with separate
  `useAdapterValue` selectors so `getSnapshot` returns `Object.is`-stable
  primitives and avoids `useSyncExternalStore` loops; the sorted tab list is
  `useMemo`'d.
- **Dialog rendered as an overlay.** Mounted once via `dock:overlays`, not
  pinned per-button, so a single instance services every trigger.

### Constraints

- Built on `@statewalker/ui.view.shadcn` primitives (`Dialog`, `Button`,
  `cn`, …) and `lucide-react` icons; the dialog is fixed at `85vh × 90vw`
  (max `5xl`).
- Requires `react` / `react-dom` >= 18 (peer dependencies).

### Dependencies

- `@statewalker/settings.core` — the state, commands, and `settings:tabs`
  slot this fragment renders.
- `@statewalker/ui.view.react` — `coreViewsSlot`, `useAdapter`,
  `useAdapterValue`, `useSlot` / `useKeyedSlot`, `compareByOrderAndId`,
  `ViewComponent`.
- `@statewalker/ui.view.shadcn` — dialog / button primitives and `cn`.
- `@statewalker/shell.core` — `dockOverlaysSlot` for mounting the dialog.
- `@statewalker/shared-commands`, `@statewalker/shared-registry`,
  `@statewalker/shared-slots`, `@statewalker/workspace.core` — fragment
  wiring.
- `@statewalker/workspace.view.react` — workspace-aware React surfaces.
- `lucide-react` — the settings icon.

## Related

- `@statewalker/settings.core` — the
  React-free logic fragment (state, commands, `settings:tabs` slot) this
  renderer pairs with.

## License

MIT — see the monorepo root `LICENSE`.
