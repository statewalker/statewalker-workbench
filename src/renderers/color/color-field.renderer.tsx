import { useUpdates } from "@repo/shared-react/hooks";
import type { ColorFieldView } from "@repo/shared-views";

export function ColorFieldRenderer({ model }: { model: ColorFieldView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      Color field placeholder
    </div>
  );
}
