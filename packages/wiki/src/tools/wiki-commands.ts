import { Command, Commands, passthrough } from "@statewalker/shared-commands";
import type { Workspace } from "@statewalker/workspace.core";
import { type WikiAskResult, type WikiSearchResult, wikiAsk, wikiSearch } from "./wiki-ops.js";

/** Input for `wiki:search` — same shape as the `wiki_search` tool. */
export interface WikiSearchInput {
  query: string;
  paths?: string[];
}

/** Input for `wiki:ask` — same shape as the `wiki_ask` tool. */
export interface WikiAskInput {
  question: string;
  paths?: string[];
}

/**
 * `wiki:search` — cross-wiki retrieval as a system command. Resolves the same
 * aggregated, project-qualified result as the `wiki_search` chat tool (both call the
 * shared `wikiSearch` core).
 */
export const WikiSearchCommand = Command.async("wiki:search")
  .input(passthrough<WikiSearchInput>())
  .output(passthrough<WikiSearchResult>())
  .label("Wiki: Search")
  .build();

/**
 * `wiki:ask` — per-wiki grounded answers as a system command. Resolves the same
 * project-tagged answers as the `wiki_ask` chat tool (both call the shared `wikiAsk` core).
 */
export const WikiAskCommand = Command.async("wiki:ask")
  .input(passthrough<WikiAskInput>())
  .output(passthrough<WikiAskResult>())
  .label("Wiki: Ask")
  .build();

/**
 * Register the `wiki:search` / `wiki:ask` command handlers on the workspace `Commands`
 * bus, delegating to the shared `wikiSearch` / `wikiAsk` core. Returning the promise
 * claims the command and settles it. React-free logic; the host adds any UI surface
 * (e.g. menubar items) separately. Returns an unregister function.
 */
export function registerWikiCommands(workspace: Workspace): () => void {
  const commands = workspace.requireAdapter(Commands);
  const offSearch = commands.listen(WikiSearchCommand, (cmd) => wikiSearch(workspace, cmd.payload));
  const offAsk = commands.listen(WikiAskCommand, (cmd) => wikiAsk(workspace, cmd.payload));
  return () => {
    offSearch();
    offAsk();
  };
}
