import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ColorSliderView } from "@statewalker/workbench-views";

export function ColorSliderRenderer({ model }: { model: ColorSliderView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Color color-slider placeholder</div>;
}
