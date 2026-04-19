import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorWheelView } from "@statewalker/shared-views";

export function ColorWheelRenderer({ model }: { model: ColorWheelView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Color color-wheel placeholder</div>;
}
