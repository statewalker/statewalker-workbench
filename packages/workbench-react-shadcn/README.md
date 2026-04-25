# @statewalker/workbench-react-shadcn

shadcn/ui implementation of the [`@statewalker/workbench-react`](../workbench-react) renderer contract: a complete component set built on Radix UI + Tailwind, plus the AppShell, dock layout, theme tokens, and tailwind-scanned source range.

## Why it exists

`workbench-views` defines view models (e.g. `ButtonView`, `FormView`, `MenuView`, `DockPanelView`); something has to render them as React components. This package provides the default shadcn-flavoured set so consuming apps can register all of it with one call and get a working UI. A parallel package, [`@statewalker/workbench-react-spectrum`](../workbench-react-spectrum), provides the same set on Adobe Spectrum.

## Installation

```sh
pnpm add @statewalker/workbench-react-shadcn
```

## Usage

```ts
import { initShadcnViews, AppShell } from "@statewalker/workbench-react-shadcn/layouts";
import { initDomBindings } from "@statewalker/workbench-dom";
import { newRegistry } from "@statewalker/shared-registry";
import { createRoot } from "react-dom/client";

export default function initShadcnUi(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();

  register(initShadcnViews(ctx));   // register all renderers (CSS auto-loads)
  register(initDomBindings(ctx));   // pointer / keyboard / theme

  const root = createRoot(document.getElementById("app")!);
  root.render(<AppShell context={ctx} />);
  register(() => root.unmount());

  return cleanup;
}
```

Importing `initShadcnViews` (or any other entry that pulls `init-views.ts`) auto-loads the package's CSS via a side-effect import — consumers never need to import a stylesheet themselves.

## Subpath exports

| Path | What you get |
|---|---|
| `@statewalker/workbench-react-shadcn` | `initViews`, `initAiModelViews` |
| `.../layouts` | `AppShell`, `getComponentRegistry`, `initShadcnViews`, `LayoutRenderer`, dock primitives, `useColorScheme` |
| `.../components` | Raw Radix/Tailwind components (Button, Card, Tabs, etc.) for direct use |
| `.../renderers` | Individual `XxxRenderer` components keyed off `XxxView` view models |
| `.../icons` | Lucide icon set used by the renderers |
| `.../init-views` | `initViews(ctx)` — the full registration call (CSS side-effect) |
| `.../init-ai-model-views` | AI provider model picker / catalog renderers |
| `.../theme.css`, `.../index.css` | Direct CSS entry points (rarely needed; `init-views` already auto-loads them) |

## CSS

The package's [`src/index.css`](src/index.css) imports tailwindcss + the bundled theme + an `@source` glob covering `./**/*.{ts,tsx}`. Any consumer that loads the package gets every shadcn-derived utility class scanned into the production CSS bundle without listing the package source path again.

## Internals

- **One renderer per view model.** Files under `src/renderers/<group>/` are one-to-one with the view models in `@statewalker/workbench-views`. `init-views.ts` registers all of them in a single function (76 entries today).
- **Radix UI for primitives, Tailwind for tokens.** Components track upstream shadcn/ui structure but consume CSS variables from `src/layouts/theme.css` (uses `@theme inline` so `.dark` overrides cascade through utility classes).
- **No view models live here.** This package only renders existing views from `workbench-views`. New view models go there, not here.

## Related

- [`@statewalker/workbench-views`](../workbench-views) — view models this package renders.
- [`@statewalker/workbench-react`](../workbench-react) — registry + hook this package builds on.
- [`@statewalker/workbench-react-spectrum`](../workbench-react-spectrum) — alternate renderer set.

## License

MIT — see the monorepo root `LICENSE`.
