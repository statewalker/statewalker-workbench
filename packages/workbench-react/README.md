# @statewalker/workbench-react

React glue for [`@statewalker/workbench-views`](../workbench-views): a `useUpdates` hook that re-renders on view notifications, and a `ReactComponentRegistry` that maps view models to React components.

## Why it exists

`workbench-views` is framework-agnostic and exposes an `onUpdate(fn): () => void` subscription API on every view. React components need this wired into their render cycle, and they need a way to look up "which React component renders this view" without hard-coding the table at every call site. Both concerns live here so the design-system packages (`workbench-react-shadcn`, `workbench-react-spectrum`) and consumer apps share one bridge.

## Installation

```sh
pnpm add @statewalker/workbench-react
```

## `useUpdates`

Subscribe a component to one or more `onUpdate`-style callbacks; each notification triggers a re-render.

```tsx
import { useUpdates } from "@statewalker/workbench-react";

function CounterView({ model }: { model: TestPanelModel }) {
  useUpdates(model.onUpdate);
  return <span>{model.counter}</span>;
}

// Multiple sources — both trigger a redraw:
useUpdates(model.onUpdate, model.action.onUpdate);
```

Any function with the shape `(notify: () => void) => () => void` works, including raw `BaseClass.onUpdate` and `newAdapter`-bound listeners.

## Component registry

```tsx
import {
  ComponentRegistryContext,
  ReactComponentRegistry,
  RenderSlot,
} from "@statewalker/workbench-react";

const registry = new ReactComponentRegistry();
registry.register(SomeView, SomeReactRenderer);

<ComponentRegistryContext.Provider value={registry}>
  {/* descendants can render any registered view by passing it to RenderSlot */}
  <RenderSlot model={someView} />
</ComponentRegistryContext.Provider>;
```

The registry is a `Map<Constructor, ComponentType>` keyed by view-model class. `RenderSlot` looks the model's class up via `useComponentRegistry()` and renders the matching component, or nothing if no entry is registered. There is also a context-bound `getReactComponentRegistry(ctx)` for non-React code that needs to seed the registry from a fragment's `init`.

## Internals

- **Why not just `useSyncExternalStore`?** `useUpdates` predates React 18-only consumers and supports several callbacks at once; the implementation amounts to `useState({})` + `useEffect` over the listener tuple.
- **Renderer-only** — this package contains no view models. View state stays in `workbench-views`; concrete component sets live in `workbench-react-shadcn` / `workbench-react-spectrum`.

## Related

- [`@statewalker/workbench-views`](../workbench-views) — view models this package renders.
- [`@statewalker/workbench-react-shadcn`](../workbench-react-shadcn) — shadcn/ui renderer set.
- [`@statewalker/workbench-react-spectrum`](../workbench-react-spectrum) — Adobe Spectrum renderer set.

## License

MIT — see the monorepo root `LICENSE`.
