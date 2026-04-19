# @statewalker/shared-views

Pure UI state models (XxxView / XxxModel): framework-agnostic observable primitives that renderers bind against.

## Installation

```sh
pnpm add @statewalker/shared-views
```

## Usage

```ts
import { getThemeView } from "@statewalker/shared-views";

const theme = getThemeView(context);
theme.onChange((key) => console.log("theme changed", key));
theme.mode = "dark";
```

## API

See `src/index.ts` for the full set of view/model exports covering theme, layout, URL state, panel routing, and common form primitives.

## Related

- `@statewalker/shared-dom` — DOM bindings that consume these views.
- `@statewalker/shared-react` — React renderers.

## License

MIT — see the monorepo root `LICENSE`.
