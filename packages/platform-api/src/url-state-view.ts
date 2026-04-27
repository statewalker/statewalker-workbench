/**
 * Re-export of the workspace-scoped `Navigation` token from
 * `@statewalker/workbench-views`. The legacy `UrlStateView` name and the
 * per-ctx `getUrlStateView` / `setUrlStateView` / `removeUrlStateView`
 * accessors keep resolving here so existing `@statewalker/platform-api`
 * imports continue to work.
 *
 * New code SHOULD import `Navigation` directly from
 * `@statewalker/workbench-views` and reach the workspace-scoped instance via
 * `workspace.requireAdapter(Navigation)`.
 */
export {
  getUrlStateView,
  Navigation,
  removeUrlStateView,
  setUrlStateView,
  type UrlSerializer,
  type UrlState,
  UrlStateView,
} from "@statewalker/workbench-views";
