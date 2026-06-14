# @statewalker/ai-providers

## What it is

The React-free logic fragment that turns persisted provider credentials
into runnable AI model providers. It owns `providers.json` (a versioned,
auto-migrating store of remote-provider *Connections*), builds one
`ProviderDescriptor` per connected endpoint into the `providers:remote`
slot, resolves the user's active provider+model selection, and writes it
through to the `ActiveModel` adapter that the agent runtime reads. It also
ships the `providers:select-active-model` command and the live-discovery
helper that fetches a connection's model list over HTTP.

## Why it exists

A workbench app needs a single, host-neutral place that answers two
questions: *which remote model endpoints are configured?* and *which model
is active right now?* This fragment is that place. It replaces the interim
bootstrap that briefly lived inside `@statewalker/ai-agent-runtime` (Wave
4.1): rather than hard-coding provider wiring, it loads the user's
connections from disk, exposes them as descriptors other fragments can
read or extend, and keeps `ActiveModel` in sync. Per ADR-0002 it carries
no React; the rendering half lives in a separate `*.view.react` fragment
that binds the contributed view keys.

## How to use

```sh
pnpm add @statewalker/ai-providers
```

Register the fragment **after** `initAgentRuntime` — it requires the
`ActiveModel`, `AgentRuntimeAdapter`, `Commands`, and `Slots` adapters to
already be on the workspace:

```ts
import initProviders from "@statewalker/ai-providers/fragment";

const cleanup = initProviders(ctx); // ctx carries the Workspace
// ...later
await cleanup();
```

Once active, the manager reads `<systemFolder>/providers.json` on every
`workspace.onLoad`, contributes a `ProviderDescriptor` per connected
endpoint to `providers:remote`, and resolves `config.active` into
`ActiveModel`. Consumers read the slot through the `Slots` bus and the
active selection through the `ActiveModel` adapter.

## Examples

### Reading and saving the config reactively

```ts
import { Providers } from "@statewalker/ai-providers";

const providers = workspace.requireAdapter(Providers);
console.log(providers.config.connections); // Connection[]

await providers.saveProviders({
  ...providers.config,
  active: { providerId: "openai", modelId: "gpt-4o" },
});
// or force a re-read from disk:
await providers.reload();
```

### Changing the active model imperatively

```ts
import { Commands } from "@statewalker/shared-commands";
import { SelectActiveModelCommand } from "@statewalker/ai-providers";

const commands = workspace.requireAdapter(Commands);
await commands.run(SelectActiveModelCommand, {
  providerId: "anthropic",
  modelId: "claude-3-5-sonnet",
});
// providerId: undefined clears the active model.
```

### Consuming contributed provider descriptors

```ts
import { Slots } from "@statewalker/shared-slots";
import { remoteProvidersSlot } from "@statewalker/ai-providers";

const slots = workspace.requireAdapter(Slots);
for (const desc of slots.getSnapshot(remoteProvidersSlot)) {
  const models = await desc.listModels();          // ProviderModelInfo[]
  const provider = desc.createProvider();           // ProviderV3
  // provider.languageModel(models[0].id)
}
```

### Plugging in a new provider

Other fragments contribute descriptors directly to the slot — no need to
touch this package:

```ts
import { remoteProvidersSlot, type ProviderDescriptor } from "@statewalker/ai-providers";

const dispose = slots.provide(remoteProvidersSlot, {
  id: "my-provider",
  label: "My Provider",
  kind: "custom",
  createProvider: () => myProviderV3,
  listModels: () => [{ id: "m1", label: "Model One" }],
} satisfies ProviderDescriptor);
```

### Live model discovery

```ts
import { listConnectionModels } from "@statewalker/ai-providers";

const models = await listConnectionModels({
  id: "openai",
  type: "openai",
  name: "OpenAI",
  apiKey: "sk-...",
  starredModelIds: [],
});
// DiscoveredModel[] — throws on non-2xx with status + truncated body
```

### Building a raw provider from credentials

```ts
import { createRemoteProvider } from "@statewalker/ai-providers";

const provider = createRemoteProvider("openai-compatible", {
  apiKey: "sk-anything",
  baseURL: "http://localhost:1234/v1",
  headers: [{ name: "X-Org", value: "acme" }],
});
```

## Internals

### Architectural decisions

- **Connection-centric, multi-instance model.** The store is a flat list
  of `Connection`s, each a remote endpoint with its own id, type, name,
  credentials, and per-connection `starredModelIds`. Multiple connections
  of the same canonical `type` are allowed (e.g. work + personal OpenAI),
  so descriptor ids are connection ids, not type names.

- **Descriptor as the extension contract.** A `ProviderDescriptor`
  (`id`, `label`, `kind`, `createProvider()`, `listModels()`) is the only
  thing the rest of the system sees. `createProvider` closes over
  credentials so consumers call `provider.languageModel(id)` without
  re-resolving anything. The four built-ins (OpenAI / Anthropic / Google
  canonical + OpenAI-compatible custom) are produced from connections;
  plug-in fragments contribute their own descriptors to the same slot.

- **Logic/data split.** `Providers` (extends `BaseClass`) holds the
  reactive `ProvidersConfig` snapshot and `saveProviders` / `reload`
  wrappers; `ProvidersManager` (internal) owns all mutation — reading the
  file, contributing to the slot, and writing `ActiveModel`. React
  consumers use `useAdapter(Providers)` + `useSyncExternalStore`; the
  manager calls `_setConfig` → `notify()` to re-render them.

- **View keys, not views.** The fragment exports string constants
  (`PROVIDERS_SETTINGS_TAB_VIEW_KEY`, `PROVIDERS_MODEL_PICKER_VIEW_KEY`)
  that the React fragment binds to components — keeping this package
  React-free per ADR-0002.

### Algorithms

- **Schema migration.** `loadProvidersConfig` reads `schemaVersion` and
  routes through `migrateFromV1` → `migrateFromV4` to reach the current
  v5 shape. Notable steps: v1's provider-less `active.reasoning` is
  dropped; v1–v3 fold separate `remote`/`custom` maps into a single
  `connections` list; v4's top-level `starred: StarredRef[]` array is
  fanned out into each connection's `starredModelIds` (orphan refs are
  dropped). Parse failures fall back to `emptyProvidersConfig`.

- **Discovery per type.** `listConnectionModels` hits the type-specific
  models endpoint: OpenAI `/models`, Anthropic `/v1/models` (with
  `anthropic-version`), Google `/v1beta/models?key=` (filtered to entries
  supporting `generateContent`), or the OpenAI-compatible `/models`
  route. Per-connection `headers` are merged onto every request.

- **`isConnected` gating.** A connection contributes a descriptor only if
  `discoveredModels !== undefined` — dormant shells (cleared `apiKey`, no
  discovery cache) are kept in the file for one-click re-connect but
  produce no slot contribution.

- **Active-model resolution.** `providerId === "local"` is owned by the
  local-models fragment and ignored here. Otherwise the manager looks up
  the descriptor by id in the slot snapshot; an unresolvable selection
  sets `AgentRuntimeAdapter` to `no-providers` / `no-active-model`.

### Constraints

- **Anthropic and OpenAI-compatible require a URL.** Anthropic blocks
  direct browser calls via CORS (a proxy URL is mandatory in browser
  deployments); for OpenAI-compatible the endpoint *is* the
  configuration. `validateConnectionUrl` enforces this at the
  form/Connect boundary — storage does **not**, so migrated and dormant
  connections may legitimately lack a URL.
- **Custom endpoints aren't always enumerable.** Generic
  OpenAI-compatible endpoints have no guaranteed `/models` route, so a
  custom descriptor's `listModels` returns the discovery cache or an
  empty list — the picker falls back to free-text model entry.
- **Boot order.** Must register after `initAgentRuntime`; it
  `requireAdapter`s `ActiveModel`, `AgentRuntimeAdapter`, `Commands`, and
  `Slots`.
- **`StarredRef` is transitional** — exported only for legacy downstream
  code; new code reads `Connection.starredModelIds` directly.

### Dependencies

- `@ai-sdk/provider` — the `ProviderV3` type that descriptors resolve to.
- `@statewalker/ai-agent` (`/models`) — `createRemoteProvider`,
  `createDefaultCatalog`, `ProviderName` for the built-in descriptors and
  default model lists.
- `@statewalker/ai-agent-runtime` — `ActiveModel` / `AgentRuntimeAdapter`
  the manager writes through.
- `@statewalker/workspace.core` — the `Workspace` host, its `FilesApi`,
  and adapter lifecycle (`onLoad` / `onUnload`).
- `@statewalker/shared-slots` — `providers:remote` slot definition + bus.
- `@statewalker/shared-commands` — the `providers:select-active-model`
  command.
- `@statewalker/shared-baseclass` — observable base for the `Providers`
  adapter.
- `@statewalker/shared-registry` — registry helper for the fragment init.
- `@statewalker/webrun-files` (+ `-mem` in tests) — reading and writing
  `providers.json`.

## Related

- `@statewalker/ai-providers.browser` —
  browser-platform engines (transformers.js / WebLLM) for local models.
- `@statewalker/ai-agent` — the agent runtime,
  model catalog, and `createRemoteProvider` this fragment builds on.
- `@statewalker/workspace.core` — the
  workspace host and adapter model.

## License

MIT — see the monorepo root `LICENSE`.
