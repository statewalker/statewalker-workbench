import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TooltipView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function TooltipRenderer({ model }: { model: TooltipView }) {
  useUpdates(model.onUpdate);

  return (
    <div
      className="z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md"
      role="tooltip"
    >
      {typeof model.content === "string" ? model.content : <RenderModel model={model.content} />}
    </div>
  );
}
