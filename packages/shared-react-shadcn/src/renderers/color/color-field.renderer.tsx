import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorFieldView } from "@statewalker/shared-views";

export function ColorFieldRenderer({ model }: { model: ColorFieldView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      Color field placeholder
    </div>
  );
}
