# @statewalker/workbench-dom

DOM bindings for `shared-views`: pointer, keyboard, theme, URL-state adapters, and an HTML component registry.

## Installation

```sh
pnpm add @statewalker/workbench-dom
```

## Usage

```ts
import { bindTheme, bindUrlState } from "@statewalker/workbench-dom";

bindTheme(document.documentElement);
bindUrlState(window);
```

## API

- `bindTheme` / `bindUrlState` / `bindPointer` / `bindKeyboard`: wire the DOM to the corresponding view.
- `htmlComponentsRegistryAdapter`: adapter for the shared HTML component registry.

## Related

- `@statewalker/workbench-views` — the underlying view models.
- `@statewalker/workbench-react` — React-flavored counterparts.

## License

MIT — see the monorepo root `LICENSE`.
