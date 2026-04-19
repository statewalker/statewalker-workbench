import { View } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ScrollAreaView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function ScrollAreaRenderer({ model }: { model: ScrollAreaView }) {
  useUpdates(model.onUpdate);
  const overflowX =
    model.orientation === "horizontal" || model.orientation === "both" ? "auto" : "hidden";
  const overflowY =
    model.orientation === "vertical" || model.orientation === "both" ? "auto" : "hidden";
  return (
    <View
      UNSAFE_style={{
        overflowX,
        overflowY,
        maxHeight: model.maxHeight ?? undefined,
      }}
    >
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </View>
  );
}
