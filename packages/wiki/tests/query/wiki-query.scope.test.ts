import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { ProjectBuilder, type Resource, Workspace } from "@statewalker/workspace.core";
import { beforeEach, describe, expect, it } from "vitest";
import {
  contentBuilder,
  type DocumentMetaOutput,
  type DocumentSummaryOutput,
  type EmbedFn,
  type LlmApi,
  metaBuilder,
  registerContentExtraction,
  registerKnowledgeAdapters,
  registerQuery,
  registerSearch,
  reorganizeBuilder,
  type SearchBlock,
  searchBuilder,
  summarizeBuilder,
  WikiPageSummary,
  WikiQuery,
} from "../../src/index.js";
import { registerStubLlm } from "../util/stub-llm.js";

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

const blocks = async (resource: Resource): Promise<SearchBlock[]> => {
  const summary = await resource.getAdapter(WikiPageSummary)?.get();
  if (!summary) return [];
  return summary.sections.map((s) => ({ blockId: s.key, text: `${s.title} ${s.summary}` }));
};

// A two-folder corpus: `docs/a.md` and `notes/b.md`, both about Acme founders.
async function buildProject() {
  const filesApi = new MemFilesApi({
    initialFiles: {
      "proj/docs/a.md": "Acme is a company.\nJane founded Acme.",
      "proj/notes/b.md": "Acme is a company.\nBob founded Acme.",
    },
  });
  const repository = new Workspace().setFileSystem(filesApi);
  registerContentExtraction(repository);
  registerKnowledgeAdapters();
  registerStubLlm(repository, {
    generateObject,
    embed,
    embedModel: "fixture",
    dimensionality: DIM,
  });
  registerSearch(repository, {
    embed: async (_project, text) => embed(text),
    model: () => "fixture",
    dimensionality: () => DIM,
    blocks,
  });
  registerQuery(repository);

  const project = await repository.getProject("proj", true);
  if (!project) throw new Error("no project");
  const builder = project.requireAdapter(ProjectBuilder);
  builder.registerBuilder(contentBuilder());
  builder.registerBuilder(summarizeBuilder());
  builder.registerBuilder(metaBuilder());
  builder.registerBuilder(reorganizeBuilder());
  builder.registerBuilder(searchBuilder({ inputSignal: "summarized" }));
  for await (const _ of builder.run()) {
    // drain
  }
  return project;
}

describe("WikiQuery — path-scoped retrieval", () => {
  let project: Awaited<ReturnType<typeof buildProject>>;

  beforeEach(async () => {
    project = await buildProject();
  });

  it("retrieves evidence from every folder when unscoped", async () => {
    const answer = await project.requireAdapter(WikiQuery).ask("Who founded Acme?").complete();
    const uris = new Set(answer.citations.map((c) => c.split("#")[0]));
    expect(uris.has("/docs/a.md")).toBe(true);
    expect(uris.has("/notes/b.md")).toBe(true);
  });

  it("restricts evidence to the masked paths when scoped", async () => {
    const answer = await project
      .requireAdapter(WikiQuery)
      .ask("Who founded Acme?", { paths: ["docs"] })
      .complete();
    expect(answer.evidenceCount).toBeGreaterThan(0);
    for (const c of answer.citations) expect(c.startsWith("/docs/")).toBe(true);
    const uris = answer.citations.map((c) => c.split("#")[0] ?? "");
    expect(uris.some((u) => u.startsWith("/notes/"))).toBe(false);
  });
});
