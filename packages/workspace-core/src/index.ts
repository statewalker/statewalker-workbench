export { registerChangeWorkspaceHandler } from "./handlers/change-workspace.handler.ts";
export {
  registerOpenWorkspaceHandler,
  WORKSPACE_LAST_HANDLE_PREFERENCE_KEY,
} from "./handlers/open-workspace.handler.ts";
export { assembleWorkspace } from "./impl/assemble-workspace.ts";
export { buildWorkspaceViews } from "./impl/composite-setup.ts";
export { SecretsFilesImpl } from "./impl/secrets-files.impl.ts";
export { WorkspaceImpl } from "./impl/workspace.impl.ts";
export {
  default,
  default as initWorkspaceCore,
} from "./init-workspace-core.ts";
