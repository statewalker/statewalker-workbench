import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ScrollAreaView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function ScrollAreaRenderer({ model }: { model: ScrollAreaView }) {
  useUpdates(model.onUpdate);

  const overflowClass =
    model.orientation === "horizontal"
      ? "overflow-x-auto overflow-y-hidden"
      : model.orientation === "both"
        ? "overflow-auto"
        : "overflow-y-auto overflow-x-hidden";

  return (
    <div className={overflowClass} style={{ maxHeight: model.maxHeight }}>
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </div>
  );
}
