import { ColorWheel } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorWheelView } from "@statewalker/shared-views";

export function ColorWheelRenderer({ model }: { model: ColorWheelView }) {
  useUpdates(model.onUpdate);
  let colorValue: ReturnType<typeof parseColor> | undefined;
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
