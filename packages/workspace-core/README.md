# @statewalker/workspace-core

Runtime for the workspace fragment.

## What it exports today

- **`buildWorkspace(ctx, files, label, config)`** — builds and wires the
  shared `Workspace` impl with composite-files setup, secrets, settings, and
  system-files adapters.
- **`registerOpenWorkspaceHandler` / `registerChangeWorkspaceHandler`** —
  intent handlers for `workspace:open` / `workspace:change`. Today they
  call `runPickDirectory` from `@statewalker/platform-api` directly.
- **`initWorkspaceCore(ctx) → cleanup`** — registers both handlers and
  returns the cleanup. Will be renamed to `initWorkspace` and extended
  to also start the main controller in the next phase of the migration.

## What changes next

The next migration step extends this package per the workspace-bootstrap
plan ([openspec/changes/workbench-workspace-bootstrap](../../../../openspec/changes/workbench-workspace-bootstrap)):

- **`workspace:change` payload** gains `{ files?: FilesApi; label?: string }` for non-interactive activation.
- **`request-file-system.view.ts`** — toolkit-neutral `DialogView` factory.
- **`startWorkspace(ctx)`** — main controller that publishes the
  "Change workspace folder…" `ActionView` and fires the bootstrap intent
  when `!workspace.isOpened`.
- **`initWorkspace(ctx)`** — rename of `initWorkspaceCore`, registers the
  handlers AND starts the main controller in one call.

## Layering

This package depends on `@statewalker/workbench-views` for view-models
(`DialogView`, `ContentPanelView`, `ActionView`, `MenuItemView`) and on the
existing `platform-api` / `shared-*` / `webrun-files` set. Per the layering
rule, **no `workbench-dom` or `workbench-react*` deps**. Dialog mounting
goes through the existing `publishDialog(ctx, view)` registry from
`workbench-views/shell`; the host app's UI binding (or the `workbench-dom`
`bindDialogStack`) renders from `DialogStackView`. Cancellation flows
through `UserCancelledError` from `@statewalker/platform-api`.

## Companion package

- [`@statewalker/workspace-api`](../workspace-api/README.md) — type-only
  contract: the `Workspace` interface, the `getWorkspace` /
  `setWorkspace` adapter, the `WorkspaceConfig` adapter, and the
  `workspace:open` / `workspace:change` intent declarations.
