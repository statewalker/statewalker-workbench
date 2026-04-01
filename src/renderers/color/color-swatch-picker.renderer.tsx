import { ColorSwatch, ColorSwatchPicker } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorSwatchPickerView } from "@repo/shared-views";

export function ColorSwatchPickerRenderer({
  model,
}: {
  model: ColorSwatchPickerView;
}) {
  useUpdates(model.onUpdate);
  let selectedValue;
  try {
    selectedValue = model.selectedColor
      ? parseColor(model.selectedColor)
      : undefined;
  } catch {
    selectedValue = undefined;
  }
  return (
    <ColorSwatchPicker
      value={selectedValue}
      size={model.size}
      rounding={model.rounding as any}
      onChange={(color) => {
        model.selectedColor = color.toString("hex");
      }}
    >
      {model.colors.map((c) => {
        let parsed;
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
