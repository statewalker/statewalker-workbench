export { registerChangeWorkspaceHandler } from "./handlers/change-workspace.handler.ts";
export {
  registerOpenWorkspaceHandler,
  WORKSPACE_LAST_HANDLE_PREFERENCE_KEY,
} from "./handlers/open-workspace.handler.ts";
export { buildWorkspace } from "./impl/build-workspace.ts";
export { buildWorkspaceViews } from "./impl/composite-setup.ts";
export { FilesBackedSecrets } from "./impl/secrets-files.impl.ts";
export { FilesBackedSettings } from "./impl/settings-files.impl.ts";
export { FilesBackedSystemFiles } from "./impl/system-files.impl.ts";
export { Workspace } from "./impl/workspace.impl.ts";
export {
  default,
  default as initWorkspaceCore,
} from "./init-workspace-core.ts";
