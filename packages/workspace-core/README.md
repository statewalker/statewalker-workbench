# @statewalker/workspace-core

Runtime for the workspace fragment.

## What it exports

### Fragment entry point

- **`initWorkspace(ctx, options?) → cleanup`** — registers both intent
  handlers (`workspace:open`, `workspace:change`) AND starts the main
  controller in a single call. Returns a cleanup that unregisters both
  handlers and tears down the menu in reverse order. The package's default
  export is the same function.

  Options:
  - `skipBootstrap?: boolean` — when `true`, the controller publishes the
    menu item but does **not** fire the bootstrap `workspace:change`
    intent. Useful for tests, CLI, MCP harnesses that drive activation
    themselves and want to avoid the race between bootstrap and explicit
    `runOpenWorkspace` / `runChangeWorkspace` calls.

### Activation primitives

- **`buildWorkspace(ctx, files, label, config)`** — builds and wires the
  shared `Workspace` impl with composite-files setup, secrets, settings,
  and system-files adapters.
- **`startWorkspace(ctx, options?) → cleanup`** — main controller.
  Publishes a top-level `"Settings"` `ActionView` (key `settings`) with a
  `"Change workspace"` sub-action (key `workspace.change`) via
  `publishMenu`, and on startup fires `workspace:change` if the workspace
  is not already opened (or not yet registered). `UserCancelledError`
  rejections are swallowed silently; other errors are logged via
  `console.error`.
- **`buildRequestFileSystemDialog(ctx, options?)`** — toolkit-neutral
  factory that returns `{ view: DialogView, result: Promise<{ files,
  label }> }`. The result rejects with `UserCancelledError` when the user
  dismisses the dialog or the OS picker.
- **`openRequestFileSystemDialog(ctx, options?)`** — thin wrapper that
  publishes the view via `publishDialog` and awaits the result, with the
  unpublish call wrapped in `try/finally`.
- **`registerOpenWorkspaceHandler(ctx)` / `registerChangeWorkspaceHandler(ctx)`**
  — intent handlers, exposed for hosts that want to register them
  individually (rare; prefer `initWorkspace`).

## Host responsibilities BEFORE calling `initWorkspace`

1. **Register the workspace** —
   `setWorkspace(ctx, buildWorkspace(ctx, files, label, config))`.
   Optional: when omitted, the bootstrap intent's open-handler will build
   one on first activation via the dialog path.
2. **Mount a `DialogStackView` renderer** — typically by mounting the
   workbench `AppShell` from one of the React bindings, or by calling
   `bindDialogStack(ctx)` from `@statewalker/workbench-dom` for plain DOM
   hosts.
3. **Register a `pick-directory` handler** —
   `registerPickDirectoryBrowser(getIntents(ctx))` from
   `@statewalker/platform-browser`, or a Node/test stub.
4. **(Optional) `setIntents(ctx, …)`** if the host doesn't want the
   auto-created default `Intents` bus.

## `workspace:open` vs `workspace:change`

Both intents end with the workspace opened against a `FilesApi`. The
distinction:

- **`workspace:open`** — "ensure a workspace exists." Creates it when
  none, returns the existing one when present (unless `force: true`).
- **`workspace:change`** — "rebind the workspace's `FilesApi`." Accepts
  `{ files?, label? }` payload. When `files` is supplied the dialog is
  skipped (non-interactive path for tests, CLI, MCP, `?fs=mem`); when
  absent the dialog opens. Preserves workspace identity by performing
  `await close → setFileSystem → await open` in that order.

Production hosts that want a workspace at startup should rely on
`initWorkspace`'s bootstrap fire — it issues `workspace:change` with
empty payload, which delegates to `workspace:open` when no workspace
exists.

## Layering

This package depends on `@statewalker/workbench-views` for view-models
(`DialogView`, `ContentPanelView`, `ActionView`) and on the existing
`platform-api` / `shared-*` / `webrun-files` set. **No** `workbench-dom`,
`workbench-react*`, `react`, `document`, `window`, or JSX. Dialog
mounting goes through the shared `publishDialog(ctx, view)` registry from
`workbench-views/shell`; the host app's UI binding renders from
`DialogStackView`. Cancellation flows through `UserCancelledError` from
`@statewalker/platform-api`.

## Companion package

- [`@statewalker/workspace-api`](../workspace-api/README.md) — type-only
  contract: the `Workspace` interface, the `getWorkspace` /
  `setWorkspace` adapter, the `WorkspaceConfig` adapter, and the
  `workspace:open` / `workspace:change` intent declarations.
