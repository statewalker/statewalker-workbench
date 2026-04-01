import { ColorField } from "@adobe/react-spectrum";
import { parseColor } from "@react-stately/color";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorFieldView } from "@repo/shared-views";

export function ColorFieldRenderer({ model }: { model: ColorFieldView }) {
  useUpdates(model.onUpdate);
  let colorValue: ReturnType<typeof parseColor> | undefined;
  try {
    colorValue = parseColor(model.value);
  } catch {
    colorValue = parseColor("#000000");
  }
  return (
    <ColorField
      label={model.label}
      value={colorValue}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      onChange={(color) => {
        if (color) {
          model.value = color.toString("hex");
        }
      }}
    />
  );
}
