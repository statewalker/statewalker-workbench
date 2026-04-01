import { ColorSlider } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorSliderView } from "@repo/shared-views";

export function ColorSliderRenderer({ model }: { model: ColorSliderView }) {
  useUpdates(model.onUpdate);
  let colorValue;
  try {
    colorValue = parseColor(model.value).toFormat("hsb");
  } catch {
    colorValue = parseColor("#ff0000").toFormat("hsb");
  }
  return (
    <ColorSlider
      value={colorValue}
      channel={model.channel}
      label={model.label}
      isDisabled={model.isDisabled}
      onChange={(color) => {
        model.value = color.toString("hex");
      }}
    />
  );
}
