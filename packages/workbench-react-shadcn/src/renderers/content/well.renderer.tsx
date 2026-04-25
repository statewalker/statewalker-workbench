import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { WellView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function WellRenderer({ model }: { model: WellView }) {
  useUpdates(model.onUpdate);

  return (
    <div role={model.role} className="rounded-lg border border-border bg-muted/50 p-4">
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </div>
  );
}
