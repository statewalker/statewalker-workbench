import { useUpdates } from "@statewalker/shared-react/hooks";
import type { SkeletonView } from "@statewalker/shared-views";

export function SkeletonRenderer({ model }: { model: SkeletonView }) {
  useUpdates(model.onUpdate);

  const shapeClass =
    model.variant === "circular"
      ? "rounded-full"
      : model.variant === "text"
        ? "rounded-md"
        : "rounded-md";

  const defaultSize =
    model.variant === "circular"
      ? { width: "2.5rem", height: "2.5rem" }
      : model.variant === "text"
        ? { width: "100%", height: "1rem" }
        : { width: "100%", height: "4rem" };

  return (
    <div
      className={`animate-pulse bg-muted ${shapeClass}`}
      style={{
        width: model.width ?? defaultSize.width,
        height: model.height ?? defaultSize.height,
      }}
    />
  );
}
