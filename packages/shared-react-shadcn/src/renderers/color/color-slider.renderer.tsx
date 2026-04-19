import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorSliderView } from "@statewalker/shared-views";

export function ColorSliderRenderer({ model }: { model: ColorSliderView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Color color-slider placeholder</div>;
}
