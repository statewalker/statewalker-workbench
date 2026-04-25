# @statewalker/workbench-react-spectrum

Adobe Spectrum implementation of the [`@statewalker/workbench-react`](../workbench-react) renderer contract: a component set built on `@adobe/react-spectrum`, plus a Spectrum-flavoured AppShell and provider.

## Why it exists

A parallel renderer set to [`@statewalker/workbench-react-shadcn`](../workbench-react-shadcn) for hosts that prefer Spectrum's design system. View models live once in `@statewalker/workbench-views`; this package provides one of two interchangeable renderer implementations.

## Installation

```sh
pnpm add @statewalker/workbench-react-spectrum
```

## Usage

```tsx
import { initSpectrumViews } from "@statewalker/workbench-react-spectrum/init";
import { SpectrumProvider } from "@statewalker/workbench-react-spectrum/provider";
import { SpectrumAppShell, useColorScheme } from "@statewalker/workbench-react-spectrum/layouts";
import { newRegistry } from "@statewalker/shared-registry";
import { createRoot } from "react-dom/client";

export default function initSpectrumUi(ctx: Record<string, unknown>): () => void {
  const [register, cleanup] = newRegistry();

  register(initSpectrumViews(ctx));

  function ThemedProvider({ children }: { children: React.ReactNode }) {
    const { colorScheme } = useColorScheme();
    return <SpectrumProvider colorScheme={colorScheme}>{children}</SpectrumProvider>;
  }

  const root = createRoot(document.getElementById("app")!);
  root.render(<SpectrumAppShell context={ctx} wrapper={ThemedProvider} />);
  register(() => root.unmount());

  return cleanup;
}
```

## Subpath exports

| Path | What you get |
|---|---|
| `@statewalker/workbench-react-spectrum` | `SpectrumProvider` |
| `.../layouts` | `SpectrumAppShell`, dock layout, `useColorScheme`, `useActivePanelView`, dock-context types |
| `.../renderers` | Individual `XxxRenderer` components keyed off `XxxView` view models |
| `.../init` | `initSpectrumViews(ctx)` |
| `.../provider` | `SpectrumProvider` directly (without the rest of the root barrel) |

## Internals

- **Spectrum colour scheme is propagated through `useColorScheme`.** The shell exposes the platform's resolved colour scheme; the consumer wraps `SpectrumProvider` so descendant Spectrum components pick up the same value.
- **No view models live here.** Same rule as the shadcn package.
- **No CSS auto-load.** Spectrum styles ship with `@adobe/react-spectrum` and are injected by `SpectrumProvider`; this package does not import any stylesheet.

## Related

- [`@statewalker/workbench-views`](../workbench-views) — view models this package renders.
- [`@statewalker/workbench-react`](../workbench-react) — registry + hook this package builds on.
- [`@statewalker/workbench-react-shadcn`](../workbench-react-shadcn) — alternate renderer set.

## License

MIT — see the monorepo root `LICENSE`.
