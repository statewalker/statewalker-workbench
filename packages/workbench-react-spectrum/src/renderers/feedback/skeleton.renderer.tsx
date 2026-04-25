import { View } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { SkeletonView } from "@statewalker/workbench-views";

export function SkeletonRenderer({ model }: { model: SkeletonView }) {
  useUpdates(model.onUpdate);
  const borderRadius =
    model.variant === "circular" ? "50%" : model.variant === "text" ? "4px" : "8px";
  return (
    <View
      UNSAFE_style={{
        width: model.width ?? "100%",
        height: model.height ?? (model.variant === "text" ? "1em" : "48px"),
        borderRadius,
        background: "var(--spectrum-gray-300)",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}
