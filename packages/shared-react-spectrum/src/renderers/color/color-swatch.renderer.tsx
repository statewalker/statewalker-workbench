import { ColorSwatch } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorSwatchView } from "@statewalker/shared-views";

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
