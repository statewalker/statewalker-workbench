import React from "react";
import {
  type DockNode,
  type DockSplit,
  isPanel,
  isSplit,
  useDockLayout,
} from "./dock-context.js";
import { DockPanelComponent } from "./dock-panel.js";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable.js";

function DockSplitRenderer({ split }: { split: DockSplit }) {
  const { updateSizes } = useDockLayout();

  const handleResize = (sizes: number[]) => {
    updateSizes(split.id, sizes);
  };

  return (
    <ResizablePanelGroup
      orientation={split.direction}
      onLayoutChanged={handleResize}
      className="h-full w-full"
    >
      {split.children.map((child, index) => (
        <React.Fragment key={child.id}>
          <ResizablePanel
            id={child.id}
            defaultSize={split.sizes[index]}
            minSize={10}
            className="relative"
          >
            <DockNodeRenderer node={child} />
          </ResizablePanel>
          {index < split.children.length - 1 && (
            <ResizableHandle className="bg-transparent hover:bg-border active:bg-primary/50 transition-colors aria-[orientation=horizontal]:h-2 aria-[orientation=vertical]:w-2" />
          )}
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
}

function DockNodeRenderer({ node }: { node: DockNode }) {
  if (isPanel(node)) {
    return <DockPanelComponent panel={node} />;
  }

  if (isSplit(node)) {
    return <DockSplitRenderer split={node} />;
  }

  return null;
}

export function DockLayout() {
  const { root } = useDockLayout();

  return (
    <div className="h-full w-full overflow-hidden bg-background p-1">
      <DockNodeRenderer node={root} />
    </div>
  );
}
