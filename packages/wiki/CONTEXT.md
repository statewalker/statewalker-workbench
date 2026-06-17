# Wiki (workbench integration)

The language of the wiki module as it lives inside the workbench: a wiki is a
Project in the opened Workspace, and its LLM work is configured independently of
chat, resolving model references through the shared AiConfig.

## Language

**Wiki**:
A knowledge base that is one **Project** within the opened **Workspace** carrying
the **wiki nature** — a top-level subdirectory whose artifacts live under
`.project/{pages,index,snapshots}`.
_Avoid_: vault, corpus.

**Nature** (cf. Eclipse project natures):
A marker on a **Project** that associates it with a toolchain and activates that
toolchain's adapters/builders. The substrate treats *every* top-level directory as
a Project; a Project becomes a **Wiki** only by carrying the wiki nature. The nature
is materialized by the presence of the project's wiki config (`.project/nature.wiki.json`)
and applied (builders registered) via the substrate's `applyNature`. A Project's wiki
nature is reached through one façade project adapter, `WikiNature`
(`project.requireAdapter(WikiNature)`): `exists()`, `initialize(config)`, scanning, `query()`.
_Avoid_: type, kind, flavor.

**Workspace**:
The single root directory the user opens; the substrate that hosts Projects,
Resources, and adapters.

**Connection**:
A configured remote model-provider endpoint registered in **AiConfig**; its
credentials live in the `Secrets` adapter, never inline.
_Avoid_: provider (overloaded — see Flagged ambiguities).

**Active Selection**:
The single chat model AiConfig marks active. **Chat-only** — wiki does not read it.

**Stage**:
A step of the wiki build/query pipeline (summarize, meta, reorganize, embed,
query, …) that can bind to its own model.

**Model Reference**:
A stored pointer to a model (a **Connection** plus a model id) that **AiConfig**
resolves into a runtime model. Serialized as the URI `connectionId:modelId` (split
on the first colon). Wiki holds one Model Reference per **Stage** plus one for
embeddings. See `ai-config/docs/adr/0001-model-reference-uri.md`.

## Relationships

- A **Workspace** contains zero or more **Wikis** (each a **Project**)
- A **Wiki** has one wiki configuration binding each **Stage** to a **Model Reference**
- **AiConfig** resolves a **Model Reference** to a runtime model via its **Connection**
- **Chat** uses the **Active Selection**; **Wiki** uses its own per-Stage references — they share only AiConfig's Connections and keys

## Flagged ambiguities

- "vault" (the `llm-wiki` skill / `wiki-viewer.app`) and "Project" (workbench) both
  name the same thing — resolved: in the workbench it is a **Wiki**, which *is* a Project.
- "provider" is overloaded across three things — resolved to distinct terms:
  the ai-sdk `ProviderV3` (runtime), an AiConfig **Connection** (configuration), and
  wiki's internal `LlmProvider` facade (the async→sync bridge). Use "Connection" for
  the configured endpoint.
