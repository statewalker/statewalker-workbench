# @statewalker/workspace-api

Type-only contract for the workspace fragment.

## What it exports

- **`Workspace` interface** — observable workspace with a primary `FilesApi`
  (the directory the user picked) plus a class-keyed registry of capability
  adapters (`SystemFiles`, `Secrets`, `Settings`, etc.). Lifecycle:
  constructed closed, configured via chainable `setAdapter` /
  `setFileSystem`, transitioned with `open()` / `close()`. Subscribers use
  `onLoad` / `onUnload` for per-open work and `BaseClass.onUpdate` for
  state transitions.
- **`getWorkspace` / `setWorkspace` adapter** (registry key
  `workspace:workspace`) — the single place a host app stores the
  `Workspace` instance for every fragment to consume.
- **`getWorkspaceConfig` / `setWorkspaceConfig`** — defaults for `systemDir`,
  `secretsDir`, `settingsDir`, `sessionsDir`, `modelsDir`. Hosts and tests
  override before activation.
- **Adapter tokens** — `SystemFiles`, `Secrets`, `Settings` abstract classes
  used as `Workspace.requireAdapter(SystemFiles)` keys.
- **`workspace:open` intent** — `runOpenWorkspace(intents, { force? })`.
  Creates a workspace when none exists; returns the existing one when
  `force` is falsy.
- **`workspace:change` intent** — `runChangeWorkspace(intents, { files?, label? })`.
  When `files` is supplied, rebinds non-interactively. When absent, opens
  the dialog (handled in `@statewalker/workspace-core`).

## Companion package

- [`@statewalker/workspace-core`](../workspace-core/README.md) — runtime
  implementation: `buildWorkspace`, the open/change handlers, the
  request-file-system dialog factory, the main controller, and the
  fragment-shaped `initWorkspace(ctx) → cleanup` entry point.
