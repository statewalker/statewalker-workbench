# @statewalker/models-config

## What it is

The React-free logic half of the workbench's model-management feature. It owns the commands, the json-render dialog specs, the curated metadata (capability tagging, default-starred globs, the local-model catalog), and the workspace adapters/listeners that turn user intent into writes against `@statewalker/ai-providers` and `@statewalker/ai-agent-runtime`. It is the **fragment** that contributes two Settings tabs (Models & Connections, Local Models) and the chat composer's session-model picker slot, and that drives the remote-connection refresh and local-model activation lifecycles. The companion renderer is `@statewalker/models-config.view.react`.

## Why it exists

Configuring models in chat-mini spans several concerns that don't belong in any one place: discovering models from a provider's `/v1/models` endpoint, tagging them with capabilities the upstream APIs don't reliably report, remembering which models a user starred, downloading transformers.js weights for offline use, and wiring the chosen model into both the workspace's `ActiveModel` hint and the per-session `modelRef`. This package concentrates that orchestration as a single fragment so the renderer package stays a thin set of host components and so the logic is testable without a DOM.

Per ADR 0011 it **replaces** the earlier v4 draft's three-Dialog `makeModelsConfigSpec()` factory and its `dock:overlays` overlay host: model configuration now lives inside the Settings dialog as two tabs, and the old `manage-remote-connections` / `manage-local-models` commands collapse into one `ConfigureModelsCommand`.

## How to use

```sh
pnpm add @statewalker/models-config
```

It is consumed two ways:

1. **As a fragment.** Register the default export after `initAgentRuntime` and `initProviders` (it requires both the `ActiveModel` and `Providers` adapters). It installs the slot contributions, command listeners, and the lazy `LocalModels` adapter, and returns a cleanup function.

   ```ts
   import initModelsConfig from "@statewalker/models-config/fragment";

   const cleanup = initModelsConfig(ctx); // ctx carries the Workspace
   // …later
   await cleanup();
   ```

2. **As a library** for the renderer, which imports the catalog, dialog specs, commands, constants, the `LocalModels` adapter, and the metadata helpers from the root entry point:

   ```ts
   import {
     ConfigureModelsCommand,
     RefreshConnectionModelsCommand,
     SelectModelCommand,
     LocalModels,
     modelsConfigCatalog,
     makeConnectionsTabSpec,
     makeLocalModelsTabSpec,
     capabilitiesFor,
     applyDefaultStarred,
     MODELS_CONFIG_CATALOG_ID,
   } from "@statewalker/models-config";
   ```

### Exports

| Symbol | Kind | Role |
|---|---|---|
| `default` (also `./fragment`) | fragment init | Installs slots + command listeners; registers `LocalModels` lazily. |
| `ConfigureModelsCommand` | command | Opens Settings on the Models & Connections tab (optional `typeHint`). |
| `RefreshConnectionModelsCommand` | command | Fetches `/v1/models` for one connection, tags capabilities, persists. |
| `SelectModelCommand` | command | Sets the active session's model (silent). |
| `ManageRemoteConnectionsCommand` / `ManageLocalModelsCommand` | command | **@deprecated** — fold into `ConfigureModelsCommand`. |
| `LocalModels` | adapter class | Workspace-scoped wrapper over `ModelManager` for transformers.js weights. |
| `modelsConfigCatalog` / `ModelsConfigCatalog` | json-render catalog | Component + action contract for the dialogs. |
| `makeConnectionsTabSpec` / `makeConnectionsTabInitialState` | spec factory | Connections tab body + seed state. |
| `makeLocalModelsTabSpec` / `makeLocalModelsTabInitialState` | spec factory | Local Models tab body + seed state. |
| `capabilitiesFor` / `DEFAULT_CAPABILITIES` | metadata | Model-id → capability tags. |
| `applyDefaultStarred` / `DEFAULT_STARRED_BY_TYPE` | metadata | First-connect default-starred seeding. |
| `MODELS_CONFIG_CATALOG_ID`, the viewKey/tab-id constants, `TJS_WEIGHTS_BASE_PATH` | constants | Shared keys the renderer registers against. |

## Examples

### Capability tagging

The provider `/v1/models` endpoints don't reliably report capabilities, so they are derived from the id:

```ts
import { capabilitiesFor } from "@statewalker/models-config";

capabilitiesFor("gpt-4o");                // ["chat"]  (default for unknown ids)
capabilitiesFor("text-embedding-3-small"); // ["embedding"]
capabilitiesFor("dall-e-3");              // ["image-gen"]
capabilitiesFor("tts-1");                 // ["tts"]
```

### Default-starred seeding on first connect

```ts
import { applyDefaultStarred } from "@statewalker/models-config";

applyDefaultStarred("anthropic", [
  "claude-3-5-sonnet-20241022",
  "claude-2.1",
]);
// → ["claude-3-5-sonnet-20241022"]  (matched "claude-3-5-*")

applyDefaultStarred("openai-compatible", ["llama-3-70b"]); // → [] (no curated defaults)
```

### The `LocalModels` adapter

```ts
import { LocalModels } from "@statewalker/models-config";

const local = workspace.requireAdapter(LocalModels); // lazily constructed
local.list();                 // curated catalog entries
local.status("local:smollm2-360m"); // "not-downloaded" | "downloaded" | "ready" | …
for await (const p of local.download("local:smollm2-360m")) {
  console.log(p.phase, p.progress);
}
const provider = local.buildProvider("local:smollm2-360m"); // ProviderV3 for ActiveModel
```

## Internals

### Architectural decisions

- **ADR-0002 logic/view split.** This package contains no React. Specs are plain json-render JSON; the renderer package binds components and action handlers. Both halves share the catalog (`modelsConfigCatalog`) and the viewKey/id constants so they agree on what to register where.
- **Two Settings tabs, no overlay host (ADR 0011).** The fragment provides two `settingsTabSlot` entries (orders 20 and 30) and one `composerActionsSlot` entry (the picker). The old single "Models" tab and `dock:overlays` host are gone.
- **`LocalModels` registered as a lazy factory.** `setAdapter(LocalModels, (ws) => new LocalModels({ files: ws.files }))` defers construction until something first calls `requireAdapter(LocalModels)` — by then the workspace is open and `workspace.files` is safe to read, and the onnxruntime/transformers.js engine is only loaded for users who actually pick a local model.
- **Observe-only local selection.** The fragment listens to `SelectActiveModelCommand` but returns early unless `providerId === "local"`, and even then it does **not** claim the command — `ai-providers`' own listener resolves it for the remote path. A second reactive bridge on `providers.onUpdate` sets `ActiveModel` when the persisted active provider is `"local"` (e.g. on reload), guarded for idempotency.

### Algorithms

- **Capability rules** (`internal/capabilities.ts`) — an ordered rule list matched left-to-right against `modelId.toLowerCase()`; first match wins; unknown ids fall back to `["chat"]` so exotic remote models stay usable in the composer (whose filter is `capabilities.includes("chat")`).
- **Default-starred globs** (`internal/default-starred.ts`) — patterns use a single `*` wildcard, compiled to anchored, case-insensitive `RegExp`s (memoised per connection type). Applied **only** on the first successful connect (when `starredModelIds` is empty); Check Connection re-fetches never re-apply them, so user un-stars are durable. `openai-compatible` ships no defaults by design.
- **Refresh** (`runRefresh` in `public/init.ts`) — fetch via `listConnectionModels`, tag each result with `capabilitiesFor`, then `saveProviders` the connection with `discoveredModels` + `discoveredAt`.
- **Local activation** (`applyLocalSelection`) — writes `ActiveModel` with `kind: "local"` and a `createProvider` that returns the `ModelStateStore` (it implements `ProviderV3` and activates ONNX weights lazily on first `languageModel(...)`), persists `local.lastActivatedKey`, then drains `manager.activate(key)` in the background.

### Constraints

- Boot order matters: register **after** the agent runtime and providers fragments.
- `dtype` for the curated local catalog is pinned to `q4` (not `q4f16`) because several onnx-community models mis-declare their KV-cache dtype and fail OrtRun otherwise — see the note in `internal/local-catalog.ts`.
- Anthropic and openai-compatible connections require a URL (anthropic because direct browser calls are CORS-blocked); the specs label these fields accordingly.
- Transformers.js runs in the browser on WASM; local-model size and warm-up cost scale with the chosen model.

### Dependencies

Sibling `@statewalker/*` packages: `ai-providers` (connection types, discovery, `Providers`/`ActiveModel` integration, `SelectActiveModelCommand`), `ai-providers.browser` (`registerLocalProvider`), `ai-agent` (`ModelManager`, `ModelStateStore`, `LocalModelConfig`), `ai-agent-runtime` (`ActiveModel`), `settings.core` (the tab slot), `workspace.core` (`getWorkspace`), `shell.core`, `shared-commands`/`shared-registry`/`shared-slots`/`shared-baseclass`, `webrun-files` (`FilesApi`), and `@repo/chat-mini.chat` (the composer-actions slot). External: `@json-render/*` (catalog/spec types), `@ai-sdk/provider` (`ProviderV3`), `zod`.

## Related

- `@statewalker/models-config.view.react` — the renderer that binds this package's catalog and specs to React components.
- `@statewalker/ai-providers` — connection model, discovery (`listConnectionModels`), and the `Providers` / `ActiveModel` persistence this fragment writes through.
- `@statewalker/ai-agent` — the `ModelManager` / `ModelStateStore` the `LocalModels` adapter wraps.

## License

MIT — see the monorepo root `LICENSE`.
