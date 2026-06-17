import type { EmbedFn } from "@statewalker/indexer-api";
import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { type Project, Workspace } from "@statewalker/workspace.core";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createWikiTools,
  type DocumentMetaOutput,
  type DocumentSummaryOutput,
  type LlmApi,
  registerWiki,
  wireWikiProject,
} from "../../src/index.js";
import { makeStubLlm, seedWikiConfig } from "../util/stub-llm.js";

const DIM = 2;
const embed: EmbedFn = async (text) => {
  const v = new Float32Array(DIM);
  if (text.toLowerCase().includes("acme")) v[0] = 1;
  if (text.toLowerCase().includes("found")) v[1] = 1;
  return v;
};

const SUMMARY: DocumentSummaryOutput = {
  title: "Acme",
  summary: "Acme and its founders.",
  sections: [
    { key: "intro", title: "Intro", startLine: 0, endLine: 0, summary: "Acme is a company." },
    {
      key: "founders",
      title: "Founders",
      startLine: 1,
      endLine: 1,
      summary: "Someone founded Acme.",
    },
  ],
};
const META: DocumentMetaOutput = {
  topics: [
    {
      key: "company-founders",
      name: "Company founders",
      description: "People who found companies.",
      sectionKeys: ["founders"],
      brief: "Acme's founders.",
    },
  ],
  outliers: [],
};

const MARKER_RE = /\[\[(\/[^\]]+)\]\]/g;

const generateObject: LlmApi["generateObject"] = async (spec) => {
  const usage = { inputTokens: 0, outputTokens: 0 };
  const out = (o: unknown) => ({ output: o as never, usage });
  switch (spec.name) {
    case "summarize-document":
      return out(SUMMARY);
    case "extract-document-meta":
      return out(META);
    case "reorganize-topics":
      return out({ actions: [] });
    case "intent-detection":
      return out({ onCorpus: true, subjects: [{ prompt: "Who founded Acme?" }] });
    case "topic-select": {
      const input = spec.input as {
        availableTopics: { key: string }[];
        availableOutliers: { key: string }[];
      };
      return out({
        topicKeys: input.availableTopics.map((t) => t.key),
        outlierKeys: input.availableOutliers.map((o) => o.key),
      });
    }
    case "section-select": {
      const docs = (spec.input as { documents: { sections: { uri: string }[] }[] }).documents;
      return out({ relevantUris: docs.flatMap((d) => d.sections.map((s) => s.uri)) });
    }
    case "summarize-batch": {
      const sections = (spec.input as { sections: string }).sections;
      const markers = [...sections.matchAll(MARKER_RE)].map((m) => m[0]).join(" ");
      return out({ text: `facts ${markers}`.trim() });
    }
    case "compose-answer": {
      const text = (spec.input as { summaries: { text: string }[] }).summaries
        .map((s) => s.text)
        .join(" ");
      const claims = [...text.matchAll(MARKER_RE)].map((m) => ({
        statement: "fact",
        citations: [m[1]],
      }));
      return out({ claims, suggestions: [], sufficient: true, missing: null });
    }
    default:
      throw new Error(`unexpected call ${spec.name}`);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: minimal tool-call options for the test
const execOpts = { toolCallId: "t", messages: [] } as any;

async function buildWorkspace(): Promise<Workspace> {
  const filesApi = new MemFilesApi({
    initialFiles: {
      "a/docs/intro.md": "Acme is a company.\nJane founded Acme.",
      "a/notes/x.md": "Acme is a company.\nMallory founded Acme.",
      "b/docs/guide.md": "Acme is a company.\nBob founded Acme.",
      // `c` is a non-wiki project (no nature) — it must be excluded from availableWikis.
      "c/readme.md": "not a wiki",
    },
  });
  const workspace = new Workspace().setFileSystem(filesApi);
  registerWiki(workspace, { llm: makeStubLlm({ generateObject, embed }) });

  for (const name of ["a", "b"]) {
    const project = (await workspace.getProject(name, true)) as Project;
    await seedWikiConfig(project, {
      models: { default: "fx-model" },
      embedModel: "fx",
      dimensionality: DIM,
    });
    const builder = wireWikiProject(project);
    for await (const _ of builder.run()) {
      // drain
    }
  }
  return workspace;
}

describe("createWikiTools", () => {
  let workspace: Workspace;

  beforeEach(async () => {
    workspace = await buildWorkspace();
  });

  it("exposes wiki_search and wiki_ask", () => {
    const tools = createWikiTools(workspace);
    expect(Object.keys(tools).sort()).toEqual(["wiki_ask", "wiki_search"]);
  });

  it("wiki_search aggregates project-qualified results across wikis", async () => {
    const tools = createWikiTools(workspace);
    const res = await tools.wiki_search?.execute?.({ query: "Acme founders" }, execOpts);
    expect(res.availableWikis.sort()).toEqual(["a", "b"]);
    const wikisHit = new Set(res.matches.map((m: { uri: string }) => m.uri.split("/")[0]));
    expect(wikisHit.has("a")).toBe(true);
    expect(wikisHit.has("b")).toBe(true);
    // URIs are project-qualified (`<project>/<relpath>`).
    for (const m of res.matches) expect(m.uri).toMatch(/^(a|b)\//);
  });

  it("wiki_search scopes both wikis with a `*/docs/*` mask", async () => {
    const tools = createWikiTools(workspace);
    const res = await tools.wiki_search?.execute?.(
      { query: "Acme founders", paths: ["*/docs/*"] },
      execOpts,
    );
    const uris = res.matches.map((m: { uri: string }) => m.uri);
    expect(uris.length).toBeGreaterThan(0);
    for (const u of uris) expect(u).toMatch(/^(a|b)\/docs\//);
    expect(uris.some((u: string) => u.includes("/notes/"))).toBe(false);
  });

  it("wiki_ask returns per-project tagged answers (default = all wikis)", async () => {
    const tools = createWikiTools(workspace);
    const res = await tools.wiki_ask?.execute?.({ question: "Who founded Acme?" }, execOpts);
    const byProject = new Map(res.answers.map((a: { project: string }) => [a.project, a]));
    expect([...byProject.keys()].sort()).toEqual(["a", "b"]);
    for (const a of res.answers) expect(a.evidenceCount).toBeGreaterThan(0);
  });

  it("wiki_ask scopes retrieval per wiki with a `*/docs/*` mask", async () => {
    const tools = createWikiTools(workspace);
    const res = await tools.wiki_ask?.execute?.(
      { question: "Who founded Acme?", paths: ["*/docs/*"] },
      execOpts,
    );
    expect(res.answers.length).toBe(2);
    for (const a of res.answers) {
      expect(a.evidenceCount).toBeGreaterThan(0);
      for (const c of a.citations) expect(c.startsWith("/docs/")).toBe(true);
    }
  });
});
