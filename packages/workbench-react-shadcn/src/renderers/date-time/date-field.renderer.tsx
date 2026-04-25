import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DateFieldView } from "@statewalker/workbench-views";

export function DateFieldRenderer({ model }: { model: DateFieldView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Date/time date-field placeholder</div>;
}
