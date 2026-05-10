import {
  compareByOrderAndId,
  useAdapter,
  useAppWorkspace,
  useSlot,
  useViewRegistry,
  type ViewComponent,
} from "@statewalker/core-react";
import type { KeyedSlot } from "@statewalker/shared-slots";
import {
  type DockOverlay,
  type DockSidePanel,
  observeDockOverlays,
  observeDockSidePanels,
} from "@statewalker/dock";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@statewalker/shadcn-react";
import { Slots } from "@statewalker/shared-slots";
import { type ReactElement, useMemo } from "react";
import { DockViewHost } from "../public/dock-view-host.js";
import { ShellHeader } from "./shell-header.js";

/**
 * Main application shell rendered by `<App/>` when the workspace is
 * `ready`. Composed declaratively from three dock slots:
 *
 *   - `dock:header-items` — rendered inside `<ShellHeader/>` at the
 *     top of the shell.
 *   - `dock:side-panels` — left/right `<ResizablePanel/>` siblings
 *     to the central `<DockViewHost/>`.
 *   - `dock:overlays` — non-layout components (modals, dialogs)
 *     mounted alongside the main layout.
 *
 * The dock host always occupies the remaining horizontal space.
 */
export function MainShell(): ReactElement {
  const workspace = useAppWorkspace();
  const slots = useAdapter(Slots);
  const registry = useViewRegistry();
  const sidePanels = useSlot(slots, observeDockSidePanels);
  const overlays = useSlot(slots, observeDockOverlays);

  const { left, right } = useMemo(() => {
    const l: DockSidePanel[] = [];
    const r: DockSidePanel[] = [];
    for (const p of sidePanels) {
      (p.side === "left" ? l : r).push(p);
    }
    l.sort(compareByOrderAndId);
    r.sort(compareByOrderAndId);
    return { left: l, right: r };
  }, [sidePanels]);

  return (
    <div className="flex h-full w-full flex-col">
      <ShellHeader />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        {left.map((panel) => (
          <PanelChunk key={panel.id} registry={registry} panel={panel} />
        ))}
        <ResizablePanel minSize="40%">
          <DockViewHost workspace={workspace} />
        </ResizablePanel>
        {right.map((panel) => (
          <PanelChunk key={panel.id} registry={registry} panel={panel} />
        ))}
      </ResizablePanelGroup>
      {overlays.map((overlay) => (
        <OverlayMount key={overlay.id} registry={registry} overlay={overlay} />
      ))}
    </div>
  );
}

function PanelChunk({
  registry,
  panel,
}: {
  registry: KeyedSlot<ViewComponent>;
  panel: DockSidePanel;
}): ReactElement | null {
  const Component = registry.get(panel.viewKey);
  if (!Component) return null;
  return (
    <>
      <ResizablePanel
        defaultSize={panel.defaultSize}
        minSize="180px"
        maxSize="40%"
      >
        <Component />
      </ResizablePanel>
      <ResizableHandle />
    </>
  );
}

function OverlayMount({
  registry,
  overlay,
}: {
  registry: KeyedSlot<ViewComponent>;
  overlay: DockOverlay;
}): ReactElement | null {
  const Component = registry.get(overlay.viewKey);
  return Component ? <Component /> : null;
}
