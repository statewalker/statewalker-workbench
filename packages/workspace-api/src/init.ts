import { getIntents } from "@statewalker/platform-api";
import { registerChangeWorkspaceHandler } from "./intents/index.js";
import { getWorkspace } from "./types/index.js";

export default function init(ctx: Record<string, unknown>): () => void {
  const intents = getIntents(ctx);
  const workspace = getWorkspace(ctx);
  return registerChangeWorkspaceHandler({ intents, workspace });
}
