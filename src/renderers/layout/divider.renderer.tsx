import { useUpdates } from "@repo/shared-react/hooks";
import type { DividerView } from "@repo/shared-views";

const sizeMap = {
  S: "1px",
  M: "2px",
  L: "4px",
};

export function DividerRenderer({ model }: { model: DividerView }) {
  useUpdates(model.onUpdate);

  if (model.orientation === "vertical") {
    return (
      <div
        className="self-stretch bg-border"
        style={{ width: sizeMap[model.size], minHeight: "1rem" }}
      />
    );
  }

  return (
    <hr
      className="w-full border-none bg-border"
      style={{ height: sizeMap[model.size] }}
    />
  );
}
