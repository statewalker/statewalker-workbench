# @statewalker/workbench-dom

DOM-side companion to [`@statewalker/workbench-views`](../workbench-views): wires browser events (pointer, keyboard, theme via `prefers-color-scheme`) into the corresponding view models, plus a small HTML component registry and the [`htl`](https://github.com/observablehq/htl) tagged-template helpers re-exported.

## Why it exists

`workbench-views` defines what the platform observes (e.g. `KeyboardInteractionView`, `PointerInteractionView`, `ThemeView`); something has to actually attach `keydown` / `pointerdown` / `prefers-color-scheme` listeners and feed them into those views. That side is browser-only, so it lives here instead of polluting `workbench-views` (which must run in Node for tests).

## Installation

```sh
pnpm add @statewalker/workbench-dom
```

## Usage

```ts
import initDomBindings from "@statewalker/workbench-dom";
// or, equivalently, as a manifest root
const manifest: AppManifest = {
  roots: ["@statewalker/workbench-dom", ...],
};

const cleanup = initDomBindings(ctx);
// ... later
cleanup();
```

`initDomBindings(ctx)` registers `bindKeyboard`, `bindPointer`, and `bindTheme` against the views found in `ctx`, returning a cleanup that detaches all listeners.

## Individual binders

If you don't want all three, import them individually:

```ts
import { bindKeyboard, bindPointer, bindTheme } from "@statewalker/workbench-dom";

const cleanup = bindTheme(ctx); // listen for prefers-color-scheme + sync getThemeView(ctx)
```

## HTML component registry

For HTML-only renderers (no React), the package ships a tiny registry that the views can resolve against:

```ts
import { getComponentRegistry, ComponentRegistry, html } from "@statewalker/workbench-dom";

const registry = getComponentRegistry(ctx);
registry.register(SomeView, (model) => html`<div class="foo">${model.label}</div>`);
```

`html` / `svg` are re-exported from `htl` — convenient template literals that produce real DOM nodes.

## Internals

- **Browser-only** — depends on `window`, `document`, `matchMedia`, etc.; do not import from Node code paths.
- **Hash routing** — URL ↔ state binding lives in [`@statewalker/platform-browser`](../platform-browser) (`bindUrlState`), not here. This package only owns the input-event side of DOM integration.

## Related

- [`@statewalker/workbench-views`](../workbench-views) — view models bound by this package.
- [`@statewalker/workbench-react`](../workbench-react) — React-side counterpart.
- [`@statewalker/platform-browser`](../platform-browser) — browser-side platform intents (pickers, downloads, clipboard, hash routing).

## License

MIT — see the monorepo root `LICENSE`.
