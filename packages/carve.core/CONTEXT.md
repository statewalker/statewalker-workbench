# carve.core (deterministic carving substrate)

The language of the deterministic substrate beneath the carving refactoring engine. This
package computes **facts** about code blocks — it never mutates code and holds no LLM logic.
Skills drive the judgement loops; `carve.core` answers "is the triad complete", "is the test
partition valid", "what is the complexity vector", "did the public API change", "what is the
implementation skeleton".

## Language

**Block**:
A unit with a declared public API and black-box contract tests at that interface. The default
block is a package directory; an internal module is **promoted** to a block by gaining its own
barrel + contract triad. Discovery reports each block's triad completeness.
_Avoid_: module (overloaded), component.

**Contract triad**:
The frozen definition of a block — goals doc (`CONTEXT.md`), public API (`src/index.ts`
barrel), and black-box contract tests (`tests/contract/**` + `acceptance.md`).

**Contract test** vs **white-box test**:
A contract test lives under `tests/contract/**` and exercises only public-barrel symbols
(black-box). Any other test is white-box and disposable. A contract test that imports a
non-barrel symbol is a **partition violation**.

**Public API surface**:
The set of symbols exported from a block's barrel, with their signatures. The unit the
**API diff** compares between two snapshots.

**Complexity vector**:
Per-block measure with axes — coupling, concepts, granularity, code volume, cohesion —
compared **lexicographically** (priority coupling > concepts > granularity > code volume).
Comments and blank lines never count toward code volume.

**Implementation skeleton**:
The code-derived part of a block's `IMPLEMENTATION.md`: file tree, per-file exported/declared
symbols + signatures, internal import/call edges, external deps. Prose narration is added by a
skill (out of scope here). Staleness = committed skeleton ≠ freshly-extracted.

## Relationships

- A **Block** has one **contract triad** and zero or more sub-blocks (promoted internals)
- A **complexity vector** and an **implementation skeleton** are computed per **Block**
- The **API diff** compares two **public API surface** snapshots of the same block
