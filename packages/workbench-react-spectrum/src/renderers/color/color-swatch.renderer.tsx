import { ColorSwatch } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ColorSwatchView } from "@statewalker/workbench-views";

export function ColorSwatchRenderer({ model }: { model: ColorSwatchView }) {
  useUpdates(model.onUpdate);
  let colorValue: ReturnType<typeof parseColor> | undefined;
  try {
    colorValue = parseColor(model.color);
  } catch {
    colorValue = parseColor("#000000");
  }
  return <ColorSwatch color={colorValue} size={model.size} />;
}
