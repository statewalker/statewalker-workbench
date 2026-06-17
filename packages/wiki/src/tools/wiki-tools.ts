import type { Project, Workspace } from "@statewalker/workspace.core";
import { type ToolSet, tool } from "ai";
import { z } from "zod";
import { wikiConfigOf } from "../llm/index.js";
import { wikiNatureOf } from "../runtime/wiki-nature.js";
import { SearchAdapter } from "../search/index.js";
import { resolveWikiMasks, type WikiResources } from "./path-masks.js";

/** Cap on aggregated section matches returned by `wiki_search`. */
const MAX_MATCHES = 20;

const MASK_HELP =
  "Optional path masks `<project-glob>/<relpath-glob>` (project glob `*` + inner glob " +
  "`docs` targets every wiki's `docs/` subtree). A mask with no `/` matches wiki names " +
  "only. Omit to target all bound wikis. The bound wiki names are returned as `availableWikis`.";

/** The bound wikis on a workspace: every project whose wiki nature is materialized. */
async function boundWikis(workspace: Workspace): Promise<Project[]> {
  const projects = await workspace.getProjects();
  const flags = await Promise.all(projects.map((p) => wikiNatureOf(p).exists()));
  return projects.filter((_, i) => flags[i]);
}

/** A project's source resource set as project-relative uris (skips dot-segments). */
async function listResources(project: Project): Promise<string[]> {
  const filesApi = project.workspace.files;
  const base = project.path.replace(/^\/+|\/+$/g, "");
  const out: string[] = [];
  for await (const info of filesApi.list(project.path, { recursive: true })) {
    if (info.kind !== "file") continue;
    const p = info.path.replace(/^\/+/, "");
    const uri = base === "" ? p : p.startsWith(`${base}/`) ? p.slice(base.length + 1) : undefined;
    if (uri === undefined) continue;
    if (uri.split("/").some((seg) => seg.startsWith("."))) continue;
    out.push(uri);
  }
  return out;
}

/** Resolve masks to per-wiki targets, listing resources only when an inner glob needs them. */
async function targetsFor(
  workspace: Workspace,
  paths: string[] | undefined,
): Promise<{ wikis: Project[]; targets: ReturnType<typeof resolveWikiMasks> }> {
  const wikis = await boundWikis(workspace);
  const needResources = (paths ?? []).some((m) => m.includes("/"));
  const withResources: WikiResources[] = needResources
    ? await Promise.all(
        wikis.map(async (w) => ({ name: w.projectName, resources: await listResources(w) })),
      )
    : wikis.map((w) => ({ name: w.projectName, resources: [] }));
  return { wikis, targets: resolveWikiMasks(paths, withResources) };
}

/**
 * The workspace-level wiki chat tools, contributed to the `agent:tools` slot:
 * `wiki_search` (cross-wiki retrieval, project-qualified URIs) and `wiki_ask`
 * (per-wiki grounded answers). Both honour `<project-glob>/<relpath-glob>` path
 * masks. React-free logic.
 */
export function createWikiTools(workspace: Workspace): ToolSet {
  return {
    wiki_search: tool({
      description:
        "Search the bound wikis' indexed pages (hybrid full-text + vector) and return " +
        `aggregated section matches, each URI prefixed with its wiki. ${MASK_HELP}`,
      inputSchema: z.object({
        query: z.string().describe("The search query."),
        paths: z.array(z.string()).optional().describe("Path masks scoping the search."),
      }),
      outputSchema: z.object({
        availableWikis: z.array(z.string()),
        matches: z.array(
          z.object({
            uri: z.string().describe("`<project>/<relpath>` of the matching page."),
            section: z.string(),
            score: z.number(),
            snippet: z.string().optional(),
          }),
        ),
      }),
      execute: async ({ query, paths }) => {
        const { wikis, targets } = await targetsFor(workspace, paths);
        const byName = new Map(wikis.map((w) => [w.projectName, w]));
        const matches: { uri: string; section: string; score: number; snippet?: string }[] = [];
        for (const t of targets) {
          const project = byName.get(t.project);
          const search = project?.getAdapter(SearchAdapter);
          if (!project || !search) continue;
          await wikiConfigOf(project).load();
          const docs = await search.search({
            query,
            paths: t.paths.length > 0 ? t.paths : undefined,
          });
          for (const d of docs) {
            for (const s of d.sections) {
              matches.push({
                uri: `${t.project}/${d.uri}`,
                section: s.sectionKey,
                score: s.score,
                snippet: s.snippet,
              });
            }
          }
        }
        matches.sort((a, b) => b.score - a.score);
        return {
          availableWikis: wikis.map((w) => w.projectName),
          matches: matches.slice(0, MAX_MATCHES),
        };
      },
    }),

    wiki_ask: tool({
      description:
        "Ask each matching bound wiki a question and return per-wiki grounded, cited " +
        `answers (tagged by project). ${MASK_HELP}`,
      inputSchema: z.object({
        question: z.string().describe("The question to answer from the wikis."),
        paths: z.array(z.string()).optional().describe("Path masks scoping retrieval."),
      }),
      outputSchema: z.object({
        availableWikis: z.array(z.string()),
        answers: z.array(
          z.object({
            project: z.string(),
            text: z.string(),
            citations: z.array(z.string()),
            evidenceCount: z.number(),
          }),
        ),
      }),
      execute: async ({ question, paths }) => {
        const { wikis, targets } = await targetsFor(workspace, paths);
        const byName = new Map(wikis.map((w) => [w.projectName, w]));
        const answers: {
          project: string;
          text: string;
          citations: string[];
          evidenceCount: number;
        }[] = [];
        for (const t of targets) {
          const project = byName.get(t.project);
          if (!project) continue;
          const progress = await wikiNatureOf(project).query(question, {
            paths: t.paths.length > 0 ? t.paths : undefined,
          });
          const answer = await progress.complete();
          answers.push({
            project: t.project,
            text: answer.text,
            citations: answer.citations,
            evidenceCount: answer.evidenceCount,
          });
        }
        return { availableWikis: wikis.map((w) => w.projectName), answers };
      },
    }),
  };
}
