# @statewalker/platform.api

Type-only vocabulary for platform-capability intents shared by every application composed of `statewalker-workbench` fragments. A platform-specific implementation is provided by a peer fragment (`@statewalker/platform.web` for browsers; future `platform.node` / `platform.electron`); this package stays free of runtime code and can be imported under Node without a DOM shim.

## Intents

Each intent is a self-contained folder under `src/intents/`. Every folder exports four things: the string key constant, the payload / result type declarations, and the `run*` / `handle*` factory pair created via `@statewalker/shared-intents`.

| Folder | Key | Purpose |
|---|---|---|
| [`pick-directory/`](src/intents/pick-directory/) | `platform:pick-directory` | Ask the environment to present a directory picker; returns `{ files: FilesApi; label }`. |
| [`pick-file/`](src/intents/pick-file/) | `platform:pick-file` | File picker returning `{ blobs: Blob[]; names }`. |
| [`download-to-files/`](src/intents/download-to-files/) | `platform:download-to-files` | Stream a URL into a `FilesApi` path with optional resume + `AbortSignal`. |
| [`copy-to-clipboard/`](src/intents/copy-to-clipboard/) | `platform:copy-to-clipboard` | Copy text. |
| [`download-blob/`](src/intents/download-blob/) | `platform:download-blob` | Trigger a browser "Save As" for a `Blob`. |
| [`preference-get/`](src/intents/preference-get/) | `platform:preference-get` | Read a durable host-provided key/value pair. |
| [`preference-set/`](src/intents/preference-set/) | `platform:preference-set` | Write a durable host-provided key/value pair. |

`src/intents/index.ts` re-exports every folder; `src/index.ts` re-exports `./intents/index.ts` together with `./adapters.ts`.

## Adapter

The package also owns the one shared `Intents` bus every fragment uses to talk to every other fragment:

```ts
import { getIntents } from "@statewalker/platform.api";

const intents = getIntents(ctx); // auto-creates on first access
```

`getIntents` has a default factory, so there is no explicit bootstrap step — the first consumer to call it seeds the instance, and every subsequent consumer in the same `ctx` sees the same `Intents`.

## Usage

```ts
import { runPickDirectory, getIntents } from "@statewalker/platform.api";

const { files, label } = await runPickDirectory(getIntents(ctx), { title: "Select workspace" });
```
