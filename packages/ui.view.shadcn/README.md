# @statewalker/ui.view.shadcn

## What it is

The workbench's [shadcn/ui](https://ui.shadcn.com/) primitive library: a vendored set of Radix-backed React components (Button, Dialog, AlertDialog, Card, Tabs, Select, Input, Textarea, Label, Separator, ScrollArea, Collapsible, Tooltip, Avatar, and the `react-resizable-panels` wrapper `Resizable*`) plus the `cn()` class-merging helper. It is a renderer-only fragment with no logic counterpart — it owns no slots or commands; its job is to encapsulate the vendor UI substrate as a package the other renderer fragments import primitives from.

## Why it exists

shadcn/ui components are normally copied into an app's `src/components/ui` directory. In the workbench they live in their own package so the primitives are a single shared substrate rather than a free-floating folder duplicated per app, and so they fit the fragment model required by ADR 0002. Component colors come entirely from CSS variables (`--primary`, `--muted`, `--ring`, …) that are defined in `@statewalker/ui.view.react`'s stylesheet, so this library themes automatically with the substrate and switches with its `.dark` variant.

## How to use

```sh
pnpm add @statewalker/ui.view.shadcn
```

Import primitives and the `cn()` helper from the package root; import the stylesheet once at boot so Tailwind v4 discovers the classes used inside the package.

```ts
import "@statewalker/ui.view.shadcn/styles";
```

```tsx
import { Button, Dialog, DialogContent, DialogTrigger, cn } from "@statewalker/ui.view.shadcn";
```

The default export (`@statewalker/ui.view.shadcn/fragment`) is a **no-op** `init` — the fragment exists only to package the substrate; activating it has no runtime effect.

## Examples

### Buttons with variants and sizes

```tsx
import { Button } from "@statewalker/ui.view.shadcn";

<Button variant="default">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon-sm" aria-label="Close">
  <X />
</Button>
```

`buttonVariants` are `class-variance-authority` variants: `variant` ∈ `default | destructive | outline | secondary | ghost | link`; `size` ∈ `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`. `asChild` renders through a Radix `Slot` so the styling applies to a child element (e.g. an `<a>`).

### A dialog

```tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@statewalker/ui.view.shadcn";

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Settings</DialogTitle></DialogHeader>
    {/* body */}
  </DialogContent>
</Dialog>
```

### Resizable panels

```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@statewalker/ui.view.shadcn";

<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize="20%" minSize="180px"><Sidebar /></ResizablePanel>
  <ResizableHandle />
  <ResizablePanel><Main /></ResizablePanel>
</ResizablePanelGroup>
```

These wrap `react-resizable-panels` and are the primitives the shell's `MainShell` composes its side panels from. Sizes accept the underlying library's units.

### `cn()`

```ts
import { cn } from "@statewalker/ui.view.shadcn";

cn("px-2 py-1", isActive && "bg-background", "px-3"); // → "py-1 bg-background px-3"
```

`cn` is `twMerge(clsx(...))`: `clsx` resolves conditionals, `tailwind-merge` deduplicates conflicting Tailwind utilities (last wins).

## Internals

### Architectural decisions

- **Vendor substrate as a fragment.** The library is a package with a no-op `init` purely so the shadcn primitives are encapsulated per ADR 0002 instead of living as a loose `src/components` directory. It contributes nothing to the workspace at runtime.
- **Theme by CSS variable, not by prop.** Components reference semantic color tokens (`bg-primary`, `text-muted-foreground`, `border`, `ring`). The token *values* live in `ui.view.react`'s stylesheet, so theming and dark mode are owned by the substrate and apply uniformly.
- **Standard shadcn surface, lightly extended.** Components track upstream shadcn/ui; the notable local extension is the extra `Button` sizes (`xs`, `icon-xs`, `icon-sm`, `icon-lg`) used by the workbench's dense chrome (e.g. dock tabs).

### Algorithms

None of note — these are presentational primitives. The only shared logic is `cn()` (clsx + tailwind-merge).

### Constraints

- Requires Tailwind v4 in the host with the substrate stylesheet imported; the package's own `styles.css` only declares `@source` globs for content discovery and carries no token definitions of its own.
- Components are unstyled without `ui.view.react`'s CSS variables in scope — they assume the substrate theme is present.
- React-only; `react` / `react-dom` are peer dependencies (`>=18`).

### Dependencies

- `@radix-ui/*` and `radix-ui` — the unstyled, accessible behavior under each primitive (dialog, select, tabs, tooltip, scroll-area, separator, label, alert-dialog).
- `react-resizable-panels` — the `Resizable*` wrappers.
- `class-variance-authority` — variant definitions (`buttonVariants`, etc.).
- `clsx` + `tailwind-merge` — the `cn()` helper.
- `lucide-react` — icons used inside some primitives.
- `@statewalker/shared-registry` — present for fragment conformance; the components themselves are framework-agnostic.

## Related

- `@statewalker/ui.view.react` — the substrate that defines the CSS-variable theme these primitives consume and provides the React mount/hooks.
- `@statewalker/shell.view.react` — a primary consumer (resizable panels for `MainShell`, `cn()` for `LineTab`).

## License

MIT — see the monorepo root `LICENSE`.
