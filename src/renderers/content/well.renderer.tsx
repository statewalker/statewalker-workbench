import { Well } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { WellView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function WellRenderer({ model }: { model: WellView }) {
  useUpdates(model.onUpdate);
  return (
    <Well role={model.role}>
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Well>
  );
}
