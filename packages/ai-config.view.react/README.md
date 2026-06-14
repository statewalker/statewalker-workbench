# @statewalker/ai-config.view.react

## What it is

The React renderer for the "Remote Models" AI-connections settings tab. It implements the React-free contract published by `@statewalker/ai-config`: the json-render schema-typed catalog and its component bindings (a controlled `Collapsible`, a status-dot `Tabs`, and a bespoke `FieldInput`), the `AiConfig → state` projection bridge, the `AiConfig` + `Secrets` action handlers, and the settings-tab `ViewComponent` itself. Its fragment init registers the tab into the settings dialog and wires the deep-link command.

## Why it exists

Per ADR 0002 the logic/view split is the package boundary: the opaque json-render `Spec`, the catalog id, and the allowed component/action name-sets live in the React-free `@statewalker/ai-config`; everything that needs React — the schema-typed `defineCatalog`/`defineRegistry` binding (which pulls in `@json-render/react`'s `schema` via `render.view.react`), the actual React components, the action implementations, and the state bridge — lives here. This keeps `@statewalker/ai-config` portable while giving the host a drop-in settings tab. The two packages agree on the catalog id, component vocabulary, and action vocabulary so the spec and these bindings can be validated against each other.

## How to use

```sh
pnpm add @statewalker/ai-config.view.react
```

Register both fragments — the logic fragment first, then this renderer — and import its stylesheet:

```ts
import initAiConfig from "@statewalker/ai-config/fragment";
import initAiConfigView from "@statewalker/ai-config.view.react/fragment";
import "@statewalker/ai-config.view.react/styles";

initAiConfig(ctx);
initAiConfigView(ctx);
```

The renderer's init:

1. Registers the connections-tab `ViewComponent` into the `core:views` slot under the `ai-config:connections` viewKey.
2. Contributes the `settings:tabs` entry ("Remote Models", `order: 20`).
3. Listens for `ConfigureAiCommand` and opens the settings dialog on the tab via `OpenSettingsCommand`.

## Examples

### The settings-tab component (the normal entry point)

`AiConfigConnectionsTab` is registered for you by the fragment, but it is exported for direct mounting:

```tsx
import { AiConfigConnectionsTab } from "@statewalker/ai-config.view.react";

// Renders inside an AppWorkspace context; resolves AiConfig from the workspace,
// owns a per-mount json-render StateStore, and renders the spec via SpecRenderer.
<AiConfigConnectionsTab />;
```

### Building the registry directly

```ts
import {
  buildConnectionsRegistry,
  connectionsCatalog,
} from "@statewalker/ai-config.view.react";

const { registry } = buildConnectionsRegistry({
  actions: handlers, // a ConnectionsActionHandlers map bound to AiConfig + the store
});
```

The `handlers` map is produced internally by `buildActionHandlers({ aiConfig, store })`; `AiConfigConnectionsTab` assembles it for you.

`connectionsCatalog` is the schema-typed catalog: it extends `@json-render/shadcn`'s stock definitions with the panel's three custom components, plus typed params for each of the seven connection actions.

## Internals

### Architectural decisions

- **Per-mount store, mount-scoped handlers.** `AiConfigConnectionsTab` creates one json-render `StateStore` per mount (`makeConnectionsInitialState()`), builds the action handlers closed over `{ aiConfig, store }`, builds the registry, and wires the bridge — all `useMemo`-stable. The component renders the spec through `SpecRenderer`.
- **The component watches the store from outside json-render's context.** It lives *outside* `SpecRenderer`'s `JSONUIProvider`, so it subscribes to the store directly via `useSyncExternalStore` on `/ui/activeConnectionId` and calls `bridge.sync()` when the active tab changes — there is no json-render state context out there to read.
- **Three custom catalog components** replace stock shadcn variants the panel needs:
  - `ControlledCollapsible` — controlled fold via a state `openPath` (`/ui/form/settingsOpen`), so `connectConnection` can collapse the credential form on success and the user can re-expand it. Stock shadcn Collapsible is uncontrolled (`defaultOpen` only).
  - `StatusTabs` — a connection-aware `Tabs` whose triggers carry a status dot (connected / testing / error / idle) projected by the bridge. Renders only the tab strip; the active body is a sibling gated on `/persistent/active`, not a `TabsContent` child.
  - `FieldInput` — form input with `autoComplete` set explicitly plus `data-1p-ignore`/`data-lpignore` to suppress browser autofill cross-pollution, and a show/hide eye toggle for the API-key field.
- **Credentials are write-only in the UI.** The state bridge seeds `/ui/form/apiKey` blank from the domain (it never reads keys back); `connectConnection` flushes it to `Secrets` via `AiConfig.setApiKey`. The key never lands on `/persistent`, on a `Connection`, or in the persisted config.

### Algorithms

- **State bridge projection.** `createConnectionsBridge(store, aiConfig)` projects `AiConfig.listConnections()` into `/persistent/{hasConnections,tabs,active}` and swaps `/ui/form` to the selected connection's draft. A connection is "connected" once discovery has cached models on it. It re-runs on every `AiConfig` update **and** when the host re-syncs on tab change; the form is re-seeded only when the active connection id actually changes, so in-progress edits survive unrelated config updates. Neither the bridge nor the component subscribes through json-render, avoiding the new-reference notification loop.
- **Action handlers.** `connectConnection` validates a URL when required (`anthropic`/`openai-compatible`), persists the shell, flushes the key, discovers models, and — only when `starredModelIds` is empty — seeds default stars via `applyDefaultStarred`. `removeConnection` gates behind a confirm dialog when the connection has a stored key (`hasKey`), then advances the active tab to a neighbour. `toggleModelStar`, `addHeader`, `removeHeader` are small store/`AiConfig` mutations.

### Constraints

- Renders through `@statewalker/ui.view.shadcn` primitives; `react`/`react-dom` are peer dependencies (`>=18`). The `./styles` export is currently a placeholder hook for panel-specific tweaks.
- The catalog's component and action vocabularies must stay in lockstep with `@statewalker/ai-config`'s `CONNECTIONS_COMPONENTS` / `CONNECTIONS_ACTIONS` name-sets (the logic package's validation test enforces the spec stays within them).

### Dependencies

- `@statewalker/ai-config` — the logic contract: spec, catalog id, vocabularies, `AiConfig` adapter, `applyDefaultStarred`, `capabilitiesFor`.
- `@json-render/core` / `@json-render/shadcn` — `Spec`/`StateStore`, `defineCatalog`, and the stock shadcn component definitions/bindings extended here.
- `@statewalker/render.core` / `@statewalker/render.view.react` — `SpecRenderer`, `defineRegistry`, `schema`, and the `useStateBinding`/`useBoundProp` hooks the custom components use.
- `@statewalker/settings.core` — `settingsTabSlot`, `OpenSettingsCommand` for the tab contribution and deep-link.
- `@statewalker/ui.view.react` / `@statewalker/ui.view.shadcn` — `coreViewsSlot`/`ViewComponent`, `useAppWorkspace`, and the shadcn primitives (`Collapsible`, `Tabs`, `Input`, `Button`, …).
- `@statewalker/workspace.core` — `getWorkspace`, the adapter host.
- `@statewalker/shared-commands` / `@statewalker/shared-registry` / `@statewalker/shared-slots` — command bus, scoped cleanup, slot registration.
- `lucide-react` (eye icons), `zod` (catalog prop/param schemas).

## Related

- `@statewalker/ai-config` — the React-free logic fragment this renderer pairs with.
- `@statewalker/ai-agent-runtime` — consumes the active selection that this panel lets the user pick.
- `@statewalker/render.view.react` — the json-render React renderer this builds on.

## License

MIT — see the monorepo root `LICENSE`.
