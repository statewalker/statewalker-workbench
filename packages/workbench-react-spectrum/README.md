# @statewalker/workbench-react-spectrum

Adobe Spectrum renderers for shared-react: Spectrum component set built on `@adobe/react-spectrum`.

## Installation

```sh
pnpm add @statewalker/workbench-react-spectrum
```

## Usage

```ts
import { registerSpectrumComponents } from "@statewalker/workbench-react-spectrum";

registerSpectrumComponents(registry);
```

## API

- `registerSpectrumComponents(registry)`: populate a shared-react component registry with the Spectrum implementations.
- Named component exports for direct imports.

## Related

- `@statewalker/workbench-react` — renderer base.
- `@statewalker/workbench-react-shadcn` — alternate design-system implementation.

## License

MIT — see the monorepo root `LICENSE`.
