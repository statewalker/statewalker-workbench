import { ColorArea } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorAreaView } from "@repo/shared-views";

export function ColorAreaRenderer({ model }: { model: ColorAreaView }) {
  useUpdates(model.onUpdate);
  let colorValue: ReturnType<typeof parseColor> | undefined;
  try {
    colorValue = parseColor(model.value);
  } catch {
    colorValue = parseColor("#ff0000");
  }
  return (
    <ColorArea
      value={colorValue}
      xChannel={model.xChannel as "saturation"}
      yChannel={model.yChannel as "brightness"}
      isDisabled={model.isDisabled}
      onChange={(color) => {
        model.value = color.toString("hex");
      }}
    />
  );
}
