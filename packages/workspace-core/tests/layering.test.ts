import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Per the workspace-bootstrap layering rule, `@statewalker/workspace-api`
 * and `@statewalker/workspace-core` may import from
 * `@statewalker/workbench-views` for view-models, but MUST NOT depend on
 * any UI binding (`workbench-dom`, `workbench-react*`), import React, or
 * touch the global `document` / `window` / `navigator` at module scope.
 * They MUST NOT contain JSX file extensions.
 *
 * This test enforces the rule with a recursive grep over both packages'
 * `src/` directories. A repo-wide grep is the design.md acceptance check;
 * this in-repo test is the durable enforcement so future contributions
 * fail at `pnpm test` time, not at acceptance time.
 */

const PACKAGES = [join(here, "..", "..", "workspace-api", "src"), join(here, "..", "src")];

interface Forbidden {
  pattern: RegExp;
  hint: string;
}

const FORBIDDEN: Forbidden[] = [
  { pattern: /from\s+["']@statewalker\/workbench-dom["']/, hint: "@statewalker/workbench-dom" },
  {
    pattern: /from\s+["']@statewalker\/workbench-react(?:[-/].*)?["']/,
    hint: "@statewalker/workbench-react*",
  },
  { pattern: /from\s+["']react["']/, hint: 'from "react"' },
  { pattern: /from\s+["']react-dom(?:\/.*)?["']/, hint: 'from "react-dom"' },
  { pattern: /\bdocument\./, hint: "document." },
  { pattern: /\bwindow\./, hint: "window." },
  { pattern: /\bnavigator\./, hint: "navigator." },
];

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

function relPath(p: string): string {
  return relative(join(here, "..", ".."), p);
}

describe("workspace-{api,core} layering rule", () => {
  it("contains no JSX file extensions in src/", () => {
    const offending: string[] = [];
    for (const root of PACKAGES) {
      for (const file of walk(root)) {
        if (/\.(tsx|jsx)$/.test(file)) offending.push(relPath(file));
      }
    }
    expect(offending).toEqual([]);
  });

  it("contains no forbidden imports or globals in src/", () => {
    const violations: Array<{ file: string; line: number; pattern: string; text: string }> = [];
    for (const root of PACKAGES) {
      for (const file of walk(root)) {
        if (!/\.(ts|js|mjs|cjs)$/.test(file)) continue;
        const lines = readFileSync(file, "utf8").split("\n");
        for (let i = 0; i < lines.length; i++) {
          const text = lines[i];
          if (!text) continue;
          for (const { pattern, hint } of FORBIDDEN) {
            if (pattern.test(text)) {
              violations.push({
                file: relPath(file),
                line: i + 1,
                pattern: hint,
                text: text.trim(),
              });
            }
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
