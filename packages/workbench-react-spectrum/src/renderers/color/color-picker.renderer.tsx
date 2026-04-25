import { ColorArea, ColorSlider, Flex } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ColorPickerView } from "@statewalker/workbench-views";

export function ColorPickerRenderer({ model }: { model: ColorPickerView }) {
  useUpdates(model.onUpdate);
  let colorValue: ReturnType<typeof parseColor> | undefined;
  try {
    colorValue = parseColor(model.value).toFormat("hsb");
  } catch {
    colorValue = parseColor("#000000").toFormat("hsb");
  }
  return (
    <Flex direction="column" gap="size-100">
      <ColorArea
        value={colorValue}
        onChange={(color) => {
          model.value = color.toString("hex");
        }}
      />
      <ColorSlider
        value={colorValue}
        channel="hue"
        onChange={(color) => {
          model.value = color.toString("hex");
        }}
      />
    </Flex>
  );
}
