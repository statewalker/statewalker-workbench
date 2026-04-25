# @statewalker/workspace-core

Runtime for the workspace fragment.

## Status

Skeleton scaffold. The real exports — `buildWorkspace`, the
`workspace:open` / `workspace:change` handlers, the request-file-system
`DialogView` factory, the `startWorkspace` main controller, and the
`initWorkspace(ctx) → cleanup` fragment entry point — land in the next
migration step when the source moves from the legacy
`@repo/workspace-core` package in `statewalker-apps` into this package.

## Layering

This package depends on `@statewalker/workbench-views` for view-model
classes (DialogView, ContentPanelView, ActionView, MenuItemView). It
**does not** depend on any UI binding (`workbench-dom`,
`workbench-react*`). Dialog mounting goes through the existing
`publishDialog(ctx, view)` registry from `workbench-views/shell`; the
host app's UI binding (or the `workbench-dom` `bindDialogStack`) renders
from `DialogStackView`. Cancellation flows through `UserCancelledError`
from `@statewalker/platform-api`.

## Companion package

- [`@statewalker/workspace-api`](../workspace-api/README.md) — type-only
  contract: the `Workspace` interface, the `getWorkspace` /
  `setWorkspace` adapter, the `WorkspaceConfig` adapter, and the
  `workspace:open` / `workspace:change` intent declarations.
