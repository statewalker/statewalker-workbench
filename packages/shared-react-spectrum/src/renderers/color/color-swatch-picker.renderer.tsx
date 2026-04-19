import { ColorSwatch, ColorSwatchPicker } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorSwatchPickerView } from "@statewalker/shared-views";

export function ColorSwatchPickerRenderer({ model }: { model: ColorSwatchPickerView }) {
  useUpdates(model.onUpdate);
  let selectedValue: ReturnType<typeof parseColor> | undefined;
  try {
    selectedValue = model.selectedColor ? parseColor(model.selectedColor) : undefined;
  } catch {
    selectedValue = undefined;
  }
  return (
    <ColorSwatchPicker
      value={selectedValue}
      size={model.size}
      rounding={model.rounding === "regular" ? "default" : model.rounding}
      onChange={(color) => {
        model.selectedColor = color.toString("hex");
      }}
    >
      {model.colors.map((c) => {
        let parsed: ReturnType<typeof parseColor> | undefined;
        try {
          parsed = parseColor(c);
        } catch {
          parsed = parseColor("#000000");
        }
        return <ColorSwatch key={c} color={parsed} />;
      })}
    </ColorSwatchPicker>
  );
}
