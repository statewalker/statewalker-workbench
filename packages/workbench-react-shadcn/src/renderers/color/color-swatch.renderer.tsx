import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ColorSwatchView } from "@statewalker/workbench-views";

export function ColorSwatchRenderer({ model }: { model: ColorSwatchView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Color color-swatch placeholder</div>;
}
