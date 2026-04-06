import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorPickerView } from "@repo/shared-views";

export function ColorPickerRenderer({ model }: { model: ColorPickerView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      Color picker placeholder
    </div>
  );
}
