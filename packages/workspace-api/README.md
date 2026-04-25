# @statewalker/workspace-api

Type-only contract for the workspace fragment.

## Status

Skeleton scaffold. The real exports — the `Workspace` interface, the
`getWorkspace` / `setWorkspace` adapter (key `workspace:workspace`), the
`WorkspaceConfig` adapter, and the `workspace:open` / `workspace:change`
intents — land in the next migration step when the source moves from the
legacy `@repo/workspace-api` package in `statewalker-apps` into this
package.

## Companion package

- [`@statewalker/workspace-core`](../workspace-core/README.md) — runtime
  implementation, fragment-shaped bootstrap (`initWorkspace`), the
  request-file-system dialog factory, and the main controller that
  publishes the menu item and fires the bootstrap intent.
