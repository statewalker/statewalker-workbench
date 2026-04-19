import { View } from "@adobe/react-spectrum";
import React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { type DockNode, type DockSplit, isPanel, isSplit, useDockLayout } from "./dock-context.js";
import { SpectrumDockPanel } from "./dock-panel.js";

function SplitRenderer({ split }: { split: DockSplit }) {
  const { updateSizes } = useDockLayout();
  return (
    <Group
      orientation={split.direction}
      onLayoutChange={(layout) => {
        const sizes = split.children.map((c) => layout[c.id] ?? 0);
        updateSizes(split.id, sizes);
      }}
      style={{ height: "100%", width: "100%" }}
    >
      {split.children.map((child, i) => (
        <React.Fragment key={child.id}>
          <Panel
            id={child.id}
            defaultSize={split.sizes[i]}
            minSize={10}
            style={{ position: "relative" }}
          >
            <NodeRenderer node={child} />
          </Panel>
          {i < split.children.length - 1 && (
            <Separator
              style={{
                width: split.direction === "horizontal" ? 4 : undefined,
                height: split.direction === "vertical" ? 4 : undefined,
                background: "var(--spectrum-alias-border-color-mid, rgba(128,128,128,0.3))",
                cursor: split.direction === "horizontal" ? "col-resize" : "row-resize",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Group>
  );
}

function NodeRenderer({ node }: { node: DockNode }) {
  if (isPanel(node)) return <SpectrumDockPanel panel={node} />;
  if (isSplit(node)) return <SplitRenderer split={node} />;
  return null;
}

export function SpectrumDockLayout() {
  const { root } = useDockLayout();
  return (
    <View height="100%" width="100%" overflow="hidden" padding="size-50">
      <NodeRenderer node={root} />
    </View>
  );
}
