import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { SidebarView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function SidebarRenderer({ model }: { model: SidebarView }) {
  useUpdates(model.onUpdate);

  return (
    <aside
      className={`flex flex-col border-border bg-card transition-[width] duration-200 overflow-hidden ${
        model.side === "right" ? "border-l" : "border-r"
      }`}
      style={{
        width: model.isOpen ? model.expandedWidth : model.collapsedWidth,
      }}
    >
      {model.isOpen && (
        <div className="flex-1 overflow-auto p-2">
          {model.children.map((child) => (
            <RenderModel key={child.key} model={child} />
          ))}
        </div>
      )}
    </aside>
  );
}
