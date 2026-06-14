# @statewalker/models-config.view.react

## What it is

The React renderer half of the workbench's model-management feature. It pairs with `@statewalker/models-config` (the React-free logic): it registers that package's json-render catalog into `json:catalogs`, mounts the two Settings-tab host components (Models & Connections, Local Models) and the chat composer's session-model picker into `core:views`, and supplies the per-mount action handlers that execute connection lifecycle verbs and local-model downloads against the workspace adapters. It is a **fragment** — a default-exported `init(ctx) → cleanup`.

## Why it exists

Per the ADR-0002 logic/view split, all React/JSX lives in a separate package from the logic. This fragment is where the model-config dialogs actually get drawn: it turns the abstract specs and catalog from `@statewalker/models-config` into mounted shadcn-rendered surfaces, owns each surface's json-render `StateStore`, and projects live `Providers` / `LocalModels` adapter state into the paths the specs bind to. Per ADR 0011 it follows the logic package in retiring the v4 `dock:overlays` overlay host — the Settings dialog is the single home for model configuration.

## How to use

```sh
pnpm add @statewalker/models-config.view.react
```

```ts
import initModelsConfigReact from "@statewalker/models-config.view.react/fragment";
import "@statewalker/models-config.view.react/styles"; // Tailwind @source globs

const cleanup = initModelsConfigReact(ctx); // ctx carries the Workspace
// …later
await cleanup();
```

Register it alongside (and after) the logic fragment — the logic fragment contributes the slot **entries** (viewKeys, tab ids, picker position); this fragment registers the **components** under those same viewKeys. React 18+ is a peer dependency.

### Exports

The public API surface is the fragment init itself (`default`, also at `./fragment`); `./styles` is the CSS entry. Everything else (the tab hosts, the picker, action handlers, the state bridge, the catalog builder, the `FieldInput` / `Markdown` component bindings) is internal implementation detail.

## Examples

### Registering the fragment

```ts
import initModelsConfig from "@statewalker/models-config/fragment";
import initModelsConfigReact from "@statewalker/models-config.view.react/fragment";
import "@statewalker/models-config.view.react/styles";

// boot order: providers + agent runtime first, then logic, then renderer
const cleanupLogic = initModelsConfig(ctx);
const cleanupView = initModelsConfigReact(ctx);
```

### What gets registered

```
json:catalogs   ← models-config catalog (shadcn components + Markdown + FieldInput)
core:views      ← models-config:connections-tab  → <ModelsConfigConnectionsTab/>
core:views      ← models-config:local-tab        → <ModelsConfigLocalTab/>
core:views      ← models-config:composer-picker  → <ComposerSessionModelPicker/>
```

The viewKeys are the constants exported by `@statewalker/models-config`, so both fragments agree on the wiring.

## Internals

### Architectural decisions

- **Per-mount stores and handlers.** Each tab host (`ModelsConfigConnectionsTab`, `ModelsConfigLocalTab`) creates its own `StateStore` and its own action-handler map via `useMemo`, then renders through `<JSONUIProvider>` + `<Renderer>`. State doesn't leak between mounts or between the two tabs.
- **Stub catalog at the slot, real handlers at the host.** The catalog registered into `json:catalogs` is built with **no-op** action handlers (it exists for catalog-metadata lookups); the mounted hosts build a second registry with mount-scoped handlers that close over the workspace. This keeps the globally-registered catalog free of mount-specific closures.
- **No stale closures in handlers.** `buildActionHandlers` captures the workspace and store once, but every handler reads `providers.config` fresh on each call, so persisted state is always current.
- **`FieldInput` instead of stock shadcn `Input`** for the connection forms. It sets `autoComplete` explicitly (`off` / `new-password`) plus `data-1p-ignore` / `data-lpignore`, because browsers and password managers otherwise cross-populate the four sibling provider tabs' API-key and name fields. It also adds an eye / eye-off reveal toggle for password fields.
- **`Markdown` reuses the chat pipeline.** The `Markdown` catalog primitive binds to `chat-mini.chat-react`'s `Markdown` component — the same renderer used for chat message bodies — so local-model descriptions render consistently.

### Algorithms

- **Connect / Check lifecycle** (`internal/action-handlers.ts`) — `connectConnection` validates the URL, fetches the model list, tags capabilities, and only persists **after** discovery succeeds; on a first connect (empty `starredModelIds`) it seeds stars from the curated defaults. `checkConnection` re-fetches, preserves user stars, and prunes stars whose ids vanished — it never re-applies defaults. `disconnectConnection` clears the api key, discovered models, and stars but keeps the connection shell for one-click re-connect.
- **State bridge** (`internal/state-bridge.ts`) — `bindLocalModels` subscribes the Local Models tab's store to `Providers` and `LocalModels` updates, projecting a flattened `localModelsList` (catalog entry × download status). `bindPersistent` is the broader projection retained for the transitional overlay host. The Connections tab projects its own per-type view directly in the component (`projectByType`) rather than through the bridge.
- **Composer picker recovery** (`composer-session-model-picker.tsx`) — reads the session's stored `modelRef`, falls back to the workspace `ActiveModel` hint, validates the choice against the live `Providers` state (connected + starred + chat-capable), and shows a recovery banner when a stored ref no longer resolves. With zero connections it renders a loud "Configure models…" CTA that fires `ConfigureModelsCommand`.

### Constraints

- React `>=18` is a peer dependency; the package ships JSX/TSX, not pre-compiled output.
- `./styles` must be imported by the host (or its Tailwind config must include this package) — it is a Tailwind `@source` glob file, not standalone CSS rules. `sideEffects` is limited to `**/*.css`.
- Mount the picker only inside a chat panel context — it reads `useChatPanelContext()` for the active session id.
- The fragment depends on the logic fragment having already contributed the slot entries; register it second.

### Dependencies

Sibling `@statewalker/*` packages: `models-config` (catalog, specs, commands, constants, `LocalModels`, metadata helpers), `ai-providers` (connection types, discovery, `Providers`, `SelectActiveModelCommand`, `isConnected`, `validateConnectionUrl`), `ai-agent-runtime` (`AgentRuntimeAdapter` for per-session `modelRef`), `render.core` (`catalogsSlot`), `ui.view.react` (`coreViewsSlot`, `useAppWorkspace`, `useAdapter`/`useAdapterValue`), `ui.view.shadcn` (Select, Input, Button, …), `workspace.core`, the `shared-*` packages, and `@repo/chat-mini.chat-react` (composer context + `Markdown`). External: `@json-render/core|react|shadcn`, `lucide-react`.

## Related

- `@statewalker/models-config` — the React-free logic this package renders: catalog, dialog specs, commands, the `LocalModels` adapter, and the connect/refresh lifecycles.
- `@statewalker/ai-providers` — the connection model and discovery the action handlers drive.
- `@statewalker/render.core` — the `catalogsSlot` this fragment registers the json-render catalog into.

## License

MIT — see the monorepo root `LICENSE`.
