# @statewalker/inline.view.react

## What it is

The React renderer for the inline-content subsystem. It owns the
`inline-content:renderers` keyed slot (the rendering lookup table), the
`<InlineContent>` resolver that turns an `InlineContentSpec` into a rendered
component, and the five built-in inline components — `MetricCard`, `LineChart`,
`FileCard`, `DirectoryCard`, `ActionButton`. It is the view half of
`@statewalker/inline.core`, which holds the
React-free contract.

## Why it exists

Per ADR-0002 the inline-content subsystem is split logic / view. This package is
the view: the rendering slot is React-typed, so it can't live in the
framework-neutral logic package. Its init registers each built-in component
under its id into `inline-content:renderers` (so `<InlineContent>` can resolve
it) *and* contributes the matching descriptor into the logic-side
`inline-content:components` slot (so the component is discoverable). Plug-in
fragments register the same way, so the chat surface sees plug-in components
indistinguishably from built-ins.

## How to use

```sh
pnpm add @statewalker/inline.view.react
```

Three entry points:

- `@statewalker/inline.view.react` — `InlineContent`,
  `inlineContentRenderersSlot`, `InlineContentComponent`.
- `@statewalker/inline.view.react/fragment` — default-exported
  `initInlineContentReact(ctx)` renderer-fragment init (registers the five
  built-ins; returns a `cleanup` thunk).
- `@statewalker/inline.view.react/styles` — the bundled `styles.css`.

Peer-depends on `react` / `react-dom` >= 18.

## Examples

Render a spec (typically one carried in an assistant message):

```tsx
import { InlineContent } from "@statewalker/inline.view.react";
import type { InlineContentSpec } from "@statewalker/inline.core";

const spec: InlineContentSpec = {
  componentId: "line-chart",
  props: { values: [3, 5, 4, 8, 6], startLabel: "Jan", endLabel: "May" },
};

<InlineContent spec={spec} />;
```

Register a plug-in component (same path the built-ins take):

```tsx
import { inlineContentRenderersSlot, type InlineContentComponent } from "@statewalker/inline.view.react";
import { inlineComponentSlot } from "@statewalker/inline.core";
import { Slots } from "@statewalker/shared-slots";

const MyInline: InlineContentComponent = ({ props }) => <div>{String(props)}</div>;
const slots = workspace.requireAdapter(Slots);
slots.register(inlineContentRenderersSlot, "my-inline", MyInline);
slots.provide(inlineComponentSlot, { id: "my-inline", label: "My Inline" });
```

Built-in component ids and their props:

| id | props |
| --- | --- |
| `metric-card` | `{ label, value, delta?, trend?: "positive" \| "negative" }` |
| `line-chart` | `{ values: number[], startLabel?, endLabel?, height? }` |
| `file-card` | `{ uri, name?, description? }` — click fires `files:visualize` |
| `directory-card` | `{ uri, name?, entries? }` — lazy-loads via `files:load-directory`; rows fire `files:visualize` |
| `action-button` | `{ label, command, payload?, variant? }` — click fires the named command |

## Internals

### Architectural decisions

- **Two slots, one registration.** `init.ts` walks a `BUILTINS` table and, for
  each entry, both `register`s the component into `inline-content:renderers` and
  `provide`s the descriptor into `inline-content:components`. Rendering lookup and
  discoverability stay in sync.
- **`<InlineContent>` subscribes to the slot** via `useKeyedSlot`, so a
  late-registered (plug-in) component renders without a remount.
- **Unknown ids are visible, not swallowed.** Because a spec's `componentId`
  usually originates from the agent's structured output (the trust boundary), an
  unresolved id renders a small inline error chip rather than nothing. Each
  built-in independently validates its own props and shows the same chip on a
  shape mismatch.
- **`InlineContentComponent` is `ComponentType<{ props: unknown }>`.** The slot
  holds components opaquely; each casts `props` to its concrete shape internally,
  mirroring the `unknown` props in `InlineContentSpec`.
- **Components fire commands, not callbacks.** `FileCard` / `DirectoryCard` fire
  `files:visualize`; `ActionButton` fires an arbitrary command by string key.
  This keeps one component reusable across many actions with no per-action React
  bindings, and routes everything through the workspace command bus.

### Algorithms

- **`LineChart`** scales a numeric series to a fluid SVG `<polyline>` (min/max
  normalised over the configured height, x by index) — no charting dependency.
- **`DirectoryCard`** lazy-loads one level via `files:load-directory` on mount
  when `entries` is omitted, tracking `loading` / `ready` / `error` state and
  cancelling on unmount; explicit `entries` skip the load.

### Constraints

- Peer-depends on React 18+; the host must import `styles.css`.
- `DirectoryCard` is one level deep — sub-directory rows route through
  `files:visualize` rather than expanding in place.
- Command-firing components require the workspace `Commands` adapter (via
  `useAppWorkspace`).

### Dependencies

`@statewalker/inline.core` (spec/descriptor types, `inlineComponentSlot`),
`@statewalker/ui.view.react` (`useAdapter`, `useKeyedSlot`, `useAppWorkspace`),
`@statewalker/mime.core` (`VisualizeFileCommand`), `@statewalker/workspace.core`
(`LoadDirectoryCommand`, `DirectoryEntry`, `getWorkspace`),
`@statewalker/workspace.view.react`, `shared-commands` (`Commands`),
`shared-registry`, `shared-slots` (`defineKeyedSlot`, `Slots`).

## Related

- `@statewalker/inline.core` — the paired React-free
  logic fragment (spec/descriptor contract + discoverability slot); the `.core`
  ↔ `.view.react` pair.
- `@statewalker/mime.core` — owns the
  `files:visualize` command the file/directory cards fire.

## License

MIT — see the monorepo root `LICENSE`.
