# @repo/backbone-web

Browser-side module loader for the backbone system. Resolves workspace dependencies via HTTP-fetched `package.json` files, builds import maps dynamically, and loads modules in topological order via `es-module-shims`.

## Why it exists

Web applications in this monorepo need to load independently-built modules at runtime — without bundling everything at build time. backbone-web ports the backbone-server loading model to the browser: same dependency resolution algorithm, same `default(ctx) => cleanup` module contract, different I/O layer (HTTP instead of filesystem, import maps instead of Node.js resolution).

## How to use

### Shell HTML

```html
<script type="esms-options">{ "shimMode": true, "mapOverrides": true }</script>
<script async src="https://ga.jspm.io/npm:es-module-shims@2.0.0/dist/es-module-shims.js"></script>

<script type="application/json" id="shell-config">
{
  "roots": ["@ext/sandbox"],
  "modules": {
    "@repo/shared": "/modules/@repo/shared",
    "@repo/shared-views": "/modules/@repo/shared-views",
    "@ext/sandbox": "/modules/@ext/sandbox",
    "react": "https://esm.sh/react@19.2.0",
    "react/jsx-runtime": "https://esm.sh/react@19.2.0/jsx-runtime"
  }
}
</script>

<div id="app"></div>
<script type="module-shim" src="./main.js"></script>
```

### Bootstrap

```typescript
import { bootstrap, loadShellConfig, configureEsModuleShims } from "@repo/backbone-web";

configureEsModuleShims();
const config = await loadShellConfig();
const cleanup = await bootstrap(config);
```

### Shell config format

- `roots` — module names to activate (like backbone-server CLI args)
- `modules` — registry mapping names → base URLs (where `package.json` can be fetched)

### URL parameter overrides

- `?root=@ext/sandbox` — override roots
- `?module=@ext/custom:https://cdn.example.com/custom` — add/override module URL
- `?config=https://host/shell-config.json` — fetch config from URL

### Non-JS module types

The source hook handles CSS, TypeScript, and JSON automatically:

- **CSS** (`.css`): Injected as `<style>`, exported as text
- **TypeScript** (`.ts`/`.tsx`): Compiled via sucrase (strips types, transforms JSX)
- **JSON** (`.json`): Wrapped as `export default <json>`

## Internals

- **Resolution**: Uses `ModuleResolver` from `@repo/backbone-common` with HTTP fetch callbacks. Fetches `package.json` for each module, extracts `workspace:*` dependencies, recurses.
- **Import map construction**: Reads `exports` field from each module's `package.json`. Generates one import map entry per sub-path export. Non-workspace deps (react, zod) are leaf nodes — their registry URL is used directly.
- **es-module-shims**: Always runs in shim mode. Source hook handles non-JS types. `mapOverrides: true` allows runtime import map updates.
- **Dependencies**: `@repo/backbone-common` (resolution + sort), `@repo/shared` (registry), `sucrase` (TypeScript compilation).

## License

MIT
