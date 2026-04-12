# @repo/backbone-common

Platform-agnostic module resolution and dependency ordering for the backbone loader. Used by both `@repo/backbone-server` (Node.js) and `@repo/backbone-web` (browser).

## Why it exists

The backbone module loading system resolves workspace dependencies from `package.json`, topologically sorts them, and loads them in order. The core algorithm has zero platform dependencies — only the I/O layer (filesystem vs HTTP) differs between Node.js and browser. This package extracts the shared logic so both platforms reuse the same resolution and sorting code.

## How to use

```typescript
import { ModuleResolver, topoSort, formatModulesMap } from "@repo/backbone-common";
```

### ModuleResolver

Builds a dependency graph from `package.json` files. Platform-specific I/O is injected via callbacks:

```typescript
const resolver = new ModuleResolver({
  // Resolve a module name to its URL (platform-specific)
  async resolve(baseUrl: string, moduleId: string): Promise<string> {
    return `https://host/modules/${moduleId}/index.js`;
  },

  // Find the package.json URL for a module
  async findPackageJson(moduleUrl: string): Promise<string> {
    return moduleUrl.replace(/\/[^/]+$/, "/package.json");
  },

  // Load and parse a package.json
  async loadPackageJson(packageJsonUrl: string): Promise<Record<string, unknown>> {
    const res = await fetch(packageJsonUrl);
    return res.json();
  },
});

const ordered = await resolver.resolveModules("file:///app/package.json", [
  "@repo/my-app",
]);
// Returns: ResolvedModule[] in topological order
// Each: { name, url, version, packageJsonUrl }
```

The resolver extracts `workspace:*` entries from `dependencies` and recursively resolves them. Non-workspace dependencies are ignored (they are leaf nodes).

### topoSort

Kahn's algorithm with alphabetical tie-breaking:

```typescript
const graph = new Map([
  ["shared", { name: "shared", deps: [] }],
  ["logger", { name: "logger", deps: ["shared"] }],
  ["app",    { name: "app",    deps: ["logger", "shared"] }],
]);

const sorted = topoSort(graph);
// → [shared, logger, app]
```

Throws on circular dependencies with the names of involved modules.

### formatModulesMap

Groups loaded modules by URI scheme for readable logging:

```typescript
const formatted = formatModulesMap({
  "@repo/shared": "file:///workspace/packages/shared/src/index.ts",
  "@repo/logger": "file:///workspace/packages/logger/src/index.ts",
});
// → { "file:///workspace/packages/": { "@repo/shared": "shared/src/index.ts", ... } }
```

## Module contract

Every module loaded by backbone follows this contract:

```typescript
// Default export is optional. If present and is a function,
// the loader calls it with a shared context object.
// It may return a cleanup function for graceful shutdown.
export default async function activate(
  context: Record<string, unknown>
): Promise<(() => void) | void> {
  // Register services, adapters, etc. on the context
  return () => { /* teardown */ };
}
```

Modules without a default function export are simply loaded — the loader skips activation.

## Internals

- **Dependency graph**: Built via BFS. For each module, `loadPackageJson` is called to read dependencies. Only `workspace:*` entries trigger recursion.
- **Topological sort**: Kahn's algorithm with stable tie-breaking (alphabetical by default, configurable via comparator). Detects cycles and throws with the cycle participants.
- **Callback injection**: `ModuleResolver` has zero I/O of its own. All platform-specific operations are injected via `ModuleResolverOptions`. This is what makes the class usable across Node.js and browser.

## License

MIT
