import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorSwatchPickerView } from "@repo/shared-views";

export function ColorSwatchPickerRenderer({
  model,
}: {
  model: ColorSwatchPickerView;
}) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Color color-swatch-picker placeholder
    </div>
  );
}
