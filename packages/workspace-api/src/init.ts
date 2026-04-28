import { Intents } from "@statewalker/shared-intents";
import { registerChangeWorkspaceHandler } from "./intents/index.js";
import { getWorkspace } from "./types/index.js";

export default function init(ctx: Record<string, unknown>): () => void {
  const workspace = getWorkspace(ctx);
  const intents = workspace.requireAdapter(Intents);
  return registerChangeWorkspaceHandler({ intents, workspace });
}
