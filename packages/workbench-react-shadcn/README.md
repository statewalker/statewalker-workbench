# @statewalker/workbench-react-shadcn

shadcn/ui renderers for shared-react: default component set built on Radix UI and Tailwind.

## Installation

```sh
pnpm add @statewalker/workbench-react-shadcn
```

## Usage

```ts
import { registerShadcnComponents } from "@statewalker/workbench-react-shadcn";

registerShadcnComponents(registry);
```

## API

- `registerShadcnComponents(registry)`: populate a shared-react component registry with the shadcn implementations.
- Named component exports for direct imports.

## Related

- `@statewalker/workbench-react` — renderer base.
- `@statewalker/workbench-views` — view contracts these components satisfy.

## License

MIT — see the monorepo root `LICENSE`.
