# @statewalker/carve.core

Deterministic substrate for the carving refactoring engine. Computes facts about code
blocks — block discovery, contract/white-box test partition, complexity-vector metrics,
public-API diff, and `IMPLEMENTATION.md` skeleton extraction. Read-only; no mutation, no LLM.

See the design note: `notes/2026-06/2026-06-22/axis-carving-refactoring-engine.md`.

## CLI

```
carve discover  <root>        # list blocks + triad completeness
carve partition <block>       # classify tests; flag contract tests importing internals
carve metrics   <block>       # emit the complexity vector as JSON
carve api-diff  <a> <b>       # diff two public-API snapshots
carve impl-map  <block>       # emit the IMPLEMENTATION.md skeleton; --check for staleness
```

## Library

The library entry (`src/index.ts`) exposes the same operations as functions over a
`ts-morph` `Project`, so they can be unit-tested against in-memory source trees.
