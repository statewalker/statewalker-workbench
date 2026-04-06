import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorSwatchView } from "@repo/shared-views";

export function ColorSwatchRenderer({ model }: { model: ColorSwatchView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Color color-swatch placeholder
    </div>
  );
}
