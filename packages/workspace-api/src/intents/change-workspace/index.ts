import { newIntent } from "@statewalker/shared-intents";
import type { Workspace } from "../../types.ts";

export const CHANGE_WORKSPACE_INTENT_KEY = "workspace:change";

/**
 * Reserved for future use (e.g. `{ mode: "browse" | "reset" }`). Today the
 * intent always triggers the platform directory picker.
 */
export type ChangeWorkspacePayload = Record<string, never>;

export interface ChangeWorkspaceResult {
  workspace: Workspace;
}

export const [runChangeWorkspace, handleChangeWorkspace] = newIntent<
  ChangeWorkspacePayload,
  ChangeWorkspaceResult
>(CHANGE_WORKSPACE_INTENT_KEY);
