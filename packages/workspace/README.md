# @statewalker/workspace

Workspace logic fragment: the `Workspace` class, its system/secrets/settings adapters, the `workspace:change` command, and the registrar init that wires the change-handler.

## What it exports

- **`Workspace` class** — observable workspace with a primary `FilesApi`
  (the directory the user picked) plus a class-keyed registry of capability
  adapters (`SystemFiles`, `Secrets`, `Settings`, etc.). Lifecycle:
  constructed closed, configured via chainable `setAdapter` /
  `setFileSystem`, transitioned with `open()` / `close()`. Subscribers use
  `onLoad` / `onUnload` for per-open work and `BaseClass.onUpdate` for
  state transitions.
- **`getWorkspace` / `setWorkspace` adapter** (registry key
  `workspace:workspace`) — the single place a host app stores the
  `Workspace` instance for every fragment to consume.
- **Adapter tokens** — `SystemFiles`, `Secrets`, `Settings` abstract classes
  used as `Workspace.requireAdapter(SystemFiles)` keys, plus the
  `FilesBackedSystemFiles` / `FilesBackedSecrets` / `FilesBackedSettings`
  default implementations registered by `initWorkspace(...)`.
- **`initWorkspace(opts)`** — constructor helper that wires a fresh
  `Workspace` (or a passed-in instance) to a `FilesApi` and the default
  files-backed adapters. Used by hosts that build the workspace before
  activation.
- **`workspace:change` command** — `runChangeWorkspace(commands, { files?, label? })`.
  When `files` is supplied, rebinds non-interactively. When absent, opens
  the unified request-file-system dialog. The handler is registered by the
  package's default-exported fragment-init.
- **`platform:pick-directory` command re-declaration** — `runPickDirectory`,
  `handlePickDirectory`. Re-declared locally (not imported from
  `@statewalker/platform-api`) to avoid a cyclic dependency.
- **`init(ctx) → cleanup`** (default export, also at `./fragment`) —
  registers the `workspace:change` handler against the workspace's
  `Commands` adapter.

## Companion packages

- [`@statewalker/workspace-bridge`](../workspace-bridge/README.md) —
  shell-side wiring for the workspace: menu item, dialog renderer,
  reconnect / disconnect commands.
- [`@statewalker/workspace-bridge-react`](../workspace-bridge-react/README.md) —
  the renderer-side bridge surfaces (`AppWorkspaceProvider`,
  `DirectoryPickerEmptyState`, `ReconnectBanner`, switch-workspace header
  item).
