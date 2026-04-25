# @statewalker/platform-browser

Browser implementation of the `@statewalker/platform-api` intents. Provides default handlers for:

- `platform:pick-directory` — File System Access API `showDirectoryPicker()`, wrapped in `BrowserFilesApi`.
- `platform:pick-file` — `showOpenFilePicker()` with `<input type="file">` fallback.
- `platform:download-to-files` — streaming `fetch` with `Range`-based resume, piped into `FilesApi.write`.
- `platform:copy-to-clipboard` — `navigator.clipboard.writeText`.
- `platform:download-blob` — anchor + `URL.createObjectURL` trick.
- `platform:preference-get` / `platform:preference-set` — `localStorage` under a `workbench:` prefix.

## Usage

The package has a single default export: `initPlatformWeb(ctx)`. Register it as a fragment in the `AppManifest`:

```ts
import initPlatformWeb from "@statewalker/platform-browser";
// or, via the manifest:
const manifest: AppManifest = {
  roots: [
    "@statewalker/platform-browser",
    // ...your application fragments
  ],
};
```

`initPlatformWeb(ctx)` resolves the shared `Intents` bus via `getIntents(ctx)` (from `@statewalker/platform-api`), registers every browser handler, and returns a cleanup function that unregisters them in reverse order.

## Peer implementations

The package ships browser-only defaults. A future `@statewalker/platform.node` or `@statewalker/platform.electron` can provide alternative implementations against the same `platform.api` contract — parallel to the `backbone-web` / `backbone-server` split. Only one `platform.*` target should be listed in a given manifest.
