# @statewalker/shared-react-spectrum

Adobe Spectrum renderers for shared-react: Spectrum component set built on `@adobe/react-spectrum`.

## Installation

```sh
pnpm add @statewalker/shared-react-spectrum
```

## Usage

```ts
import { registerSpectrumComponents } from "@statewalker/shared-react-spectrum";

registerSpectrumComponents(registry);
```

## API

- `registerSpectrumComponents(registry)`: populate a shared-react component registry with the Spectrum implementations.
- Named component exports for direct imports.

## Related

- `@statewalker/shared-react` — renderer base.
- `@statewalker/shared-react-shadcn` — alternate design-system implementation.

## License

MIT — see the monorepo root `LICENSE`.
