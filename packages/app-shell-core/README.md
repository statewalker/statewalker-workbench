# @statewalker/app-shell-core

Eclipse-style application shell core: panel management, fragment lifecycle, and shared registries that host applications wire into their manifest.

## Installation

```sh
pnpm add @statewalker/app-shell-core
```

## Usage

```ts
import { createAppShell } from "@statewalker/app-shell-core";

const shell = createAppShell({ registry });
await shell.mount(container);
```

## API

- `createAppShell(options)`: construct a shell with a registry and layout.
- `PanelManager` / `FragmentHost` / `RouteBinding`: core primitives.

## Related

- `@statewalker/shared-views` — panel/layout view models.
- `@statewalker/backbone-web` — browser runtime that loads fragments into the shell.

## License

MIT — see the monorepo root `LICENSE`.
