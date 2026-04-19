import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ColorAreaView } from "@statewalker/shared-views";

export function ColorAreaRenderer({ model }: { model: ColorAreaView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
      Color area placeholder
    </div>
  );
}
