# @statewalker/workbench-react

React renderers for `shared-views`: component registry, view-to-hook bridges, and shared layout primitives.

## Installation

```sh
pnpm add @statewalker/workbench-react
```

## Usage

```ts
import { useView } from "@statewalker/workbench-react";

function ThemePicker() {
  const theme = useView(getThemeView);
  return <button onClick={() => theme.toggle()}>{theme.mode}</button>;
}
```

## API

- `useView(view)`: subscribe a React component to an observable view.
- `ComponentRegistryProvider`: expose a registry of React components to descendants.

## Related

- `@statewalker/workbench-views` — views this package renders.
- `@statewalker/workbench-react-shadcn` / `@statewalker/workbench-react-spectrum` — concrete design-system implementations.

## License

MIT — see the monorepo root `LICENSE`.
