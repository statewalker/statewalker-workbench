import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { FlexView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function FlexRenderer({ model }: { model: FlexView }) {
  useUpdates(model.onUpdate);

  const dirClass =
    model.direction === "row"
      ? "flex-row"
      : model.direction === "column"
        ? "flex-col"
        : model.direction === "row-reverse"
          ? "flex-row-reverse"
          : "flex-col-reverse";

  const classes = [
    "flex",
    dirClass,
    model.alignItems ? `items-${model.alignItems}` : "",
    model.justifyContent ? `justify-${model.justifyContent}` : "",
    model.wrap ? "flex-wrap" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={{ gap: model.gap, padding: model.padding }}>
      {model.children.map((item) => (
        <RenderModel key={item.key} model={item} />
      ))}
    </div>
  );
}
