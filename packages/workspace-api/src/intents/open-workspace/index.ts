import { newIntent } from "@statewalker/shared-intents";
import type { Workspace } from "../../types.ts";

export const OPEN_WORKSPACE_INTENT_KEY = "workspace:open";

export interface OpenWorkspacePayload {
  /**
   * If `true` and a workspace is already open, re-prompt the user instead of
   * resolving with the current workspace. Useful for the WorkspaceStatus
   * "Change workspace" action.
   */
  force?: boolean;
}

export interface OpenWorkspaceResult {
  workspace: Workspace;
}

export const [runOpenWorkspace, handleOpenWorkspace] = newIntent<
  OpenWorkspacePayload,
  OpenWorkspaceResult
>(OPEN_WORKSPACE_INTENT_KEY);
