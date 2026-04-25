import { Well } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { WellView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function WellRenderer({ model }: { model: WellView }) {
  useUpdates(model.onUpdate);
  return (
    <Well role={model.role === "group" || model.role === "region" ? model.role : undefined}>
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Well>
  );
}
