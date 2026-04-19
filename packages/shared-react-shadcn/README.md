# @statewalker/shared-react-shadcn

shadcn/ui renderers for shared-react: default component set built on Radix UI and Tailwind.

## Installation

```sh
pnpm add @statewalker/shared-react-shadcn
```

## Usage

```ts
import { registerShadcnComponents } from "@statewalker/shared-react-shadcn";

registerShadcnComponents(registry);
```

## API

- `registerShadcnComponents(registry)`: populate a shared-react component registry with the shadcn implementations.
- Named component exports for direct imports.

## Related

- `@statewalker/shared-react` — renderer base.
- `@statewalker/shared-views` — view contracts these components satisfy.

## License

MIT — see the monorepo root `LICENSE`.
