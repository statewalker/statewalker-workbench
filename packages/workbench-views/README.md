# @statewalker/workbench-views

Pure UI state models (XxxView / XxxModel): framework-agnostic observable primitives that renderers bind against.

## Installation

```sh
pnpm add @statewalker/workbench-views
```

## Usage

```ts
import { getThemeView } from "@statewalker/workbench-views";

const theme = getThemeView(context);
theme.onChange((key) => console.log("theme changed", key));
theme.mode = "dark";
```

## API

See `src/index.ts` for the full set of view/model exports covering theme, layout, URL state, panel routing, and common form primitives.

## Related

- `@statewalker/workbench-dom` — DOM bindings that consume these views.
- `@statewalker/workbench-react` — React renderers.

## License

MIT — see the monorepo root `LICENSE`.
