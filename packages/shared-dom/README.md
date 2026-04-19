# @statewalker/shared-dom

DOM bindings for `shared-views`: pointer, keyboard, theme, URL-state adapters, and an HTML component registry.

## Installation

```sh
pnpm add @statewalker/shared-dom
```

## Usage

```ts
import { bindTheme, bindUrlState } from "@statewalker/shared-dom";

bindTheme(document.documentElement);
bindUrlState(window);
```

## API

- `bindTheme` / `bindUrlState` / `bindPointer` / `bindKeyboard`: wire the DOM to the corresponding view.
- `htmlComponentsRegistryAdapter`: adapter for the shared HTML component registry.

## Related

- `@statewalker/shared-views` — the underlying view models.
- `@statewalker/shared-react` — React-flavored counterparts.

## License

MIT — see the monorepo root `LICENSE`.
