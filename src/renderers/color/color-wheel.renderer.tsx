import { ColorWheel } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorWheelView } from "@repo/shared-views";

export function ColorWheelRenderer({ model }: { model: ColorWheelView }) {
  useUpdates(model.onUpdate);
  let colorValue;
  try {
    colorValue = parseColor(model.value).toFormat("hsb");
  } catch {
    colorValue = parseColor("#ff0000").toFormat("hsb");
  }
  return (
    <ColorWheel
      value={colorValue}
      size={model.size}
      isDisabled={model.isDisabled}
      onChange={(color) => {
        model.value = color.toString("hex");
      }}
    />
  );
}
