# @repo/backbone-server

Node.js module loader for the backbone system. Resolves workspace dependencies, topologically sorts them, and loads them in order via dynamic `import()`.

## Why it exists

Server-side applications in this monorepo are composed from independent modules. Each module registers services, adapters, or handlers on a shared context object. backbone-server provides the lifecycle: resolve → sort → load → activate → cleanup.

This is the Node.js-specific half of the backbone loader. The resolution algorithm and topological sort live in `@repo/backbone-common` (shared with `@repo/backbone-web`).

## How to use

### CLI

```bash
backbone-start @repo/my-module-a @repo/my-module-b
```

Modules are loaded in dependency order. The process stays alive until SIGINT/SIGTERM.

### Programmatic

```typescript
import { bootstrap } from "@repo/backbone-server";

const shutdown = await bootstrap(["@repo/my-module-a", "@repo/my-module-b"]);

// Later:
await shutdown(); // Tears down all modules in reverse order
```

### Writing a module

```typescript
// my-module/src/index.ts
import { newAdapter } from "@repo/shared/adapters";

const [getMyService, setMyService] = newAdapter<MyService>("service:my");

export default async function activate(
  context: Record<string, unknown>
): Promise<() => void> {
  const service = new MyService();
  setMyService(context, service);
  await service.start();

  return () => service.stop();
}
```

The module's `default` export is called with the shared context. Return a cleanup function for graceful shutdown.

## Internals

- **Resolution**: Uses `import-meta-resolve` for Node.js module resolution. Falls back to `node_modules` directory walking when a package has no root export (`ERR_PACKAGE_PATH_NOT_EXPORTED`).
- **Dependency extraction**: Reads `package.json` for each module, extracts `workspace:*` entries from `dependencies`.
- **Topological sort**: Via `@repo/backbone-common` — dependencies load before dependents.
- **Signal handling**: SIGINT and SIGTERM trigger graceful shutdown (cleanup in LIFO order).
- **Dependencies**: `@repo/backbone-common` (resolution + sort), `@repo/shared` (registry, logger), `import-meta-resolve`.

## License

MIT
