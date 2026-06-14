# @statewalker/render.view.react

## What it is

The single `@json-render/react` boundary for the workbench substrate. It
exports `<SpecRenderer>` — a thin wrapper that renders a json-render `spec`
against a `registry` inside a `<JSONUIProvider>` — plus a re-export of
json-render's `defineRegistry`, `schema`, and state hooks so renderer
fragments build catalogs and author custom component bindings without
importing `@json-render/react` directly.

## Why it exists

`@statewalker/render.core` holds json-render
specs and catalog registries **opaquely** (`unknown`) so the rest of the
workbench stays free of json-render and React (ADR-0002 logic/view split).
The concrete json-render types have to surface *somewhere* to actually
render — this package is that one place. Centralizing the boundary means
exactly one module depends on `@json-render/core` and `@json-render/react`,
and every renderer fragment goes through it.

## How to use

```sh
pnpm add @statewalker/render.view.react
```

`react` / `react-dom` (>=18) are peer dependencies.

```tsx
import { SpecRenderer } from "@statewalker/render.view.react";

function JsonPanel({ record, registry }) {
  return <SpecRenderer spec={record.spec} registry={registry} />;
}
```

`spec` and `registry` are typed `unknown` to match the opaque values from
the `SpecStore` and the `json:catalogs` slot. Pass an optional external
json-render `store` when the spec is state-driven and an outside projection
needs to seed/update it; omit it for self-contained single-component specs
(`<JSONUIProvider>` then manages its own internal store).

## Examples

### Building a registry and rendering against it

```tsx
import { defineRegistry, schema, SpecRenderer } from "@statewalker/render.view.react";

const { registry } = defineRegistry({
  // component bindings keyed by spec `type`, using `schema` for props
});

<SpecRenderer spec={mySpec} registry={registry} />;
```

### Authoring a state-bound component binding

The re-exported hooks let renderer fragments build two-way / state-path
bindings through this boundary instead of importing `@json-render/react`:

```tsx
import { useBoundProp, useStateValue } from "@statewalker/render.view.react";

function Field(props) {
  const [value, setValue] = useBoundProp(props, "value");
  const count = useStateValue("path.to.count");
  // ...
}
```

## Internals

### Architectural decisions

- **Sole boundary.** This is the only workbench module that imports
  `@json-render/core` / `@json-render/react`. Everything upstream
  (`render.core`, the dock fragment, logic fragments) stays json-render-free.
- **`unknown` at the seam.** `SpecRendererProps.spec` / `registry` / `store`
  are `unknown`; the component casts to `any` internally (with linter
  suppressions) precisely because the real types are deliberately hidden in
  the opaque stores. This contains the cast to one file.
- **`<JSONUIProvider>` + `<Renderer>`.** The provider sets up the
  visibility / validation / state contexts that `<Renderer>`'s internals
  read from; both are needed for a spec to render correctly.

### Constraints

Tiny by design — one component plus re-exports. Renderer fragments should
import json-render symbols from here, not from `@json-render/react`
directly, to keep the boundary single.

### Dependencies

- `@json-render/core`, `@json-render/react` (0.18.0) — the rendering engine
  this package wraps.
- `react` / `react-dom` (>=18) — peer dependencies.

## Related

- `@statewalker/render.core` — the React-free
  state layer (`SpecStore`, `spec:*` commands, `json:catalogs` slot) whose
  opaque specs and registries this renderer consumes.

## License

MIT — see the monorepo root `LICENSE`.
