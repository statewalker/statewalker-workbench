import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ColorFieldView } from "@statewalker/workbench-views";

export function ColorFieldRenderer({ model }: { model: ColorFieldView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      Color field placeholder
    </div>
  );
}
