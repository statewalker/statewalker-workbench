import { useUpdates } from "@repo/shared-react/hooks";
import type { GridView as GridViewType } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function GridRenderer({ model }: { model: GridViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns:
          typeof model.columns === "string"
            ? model.columns
            : model.columns?.join(" "),
        gap: model.gap,
      }}
    >
      {model.children.map((item) => (
        <RenderModel key={item.key} model={item} />
      ))}
    </div>
  );
}
