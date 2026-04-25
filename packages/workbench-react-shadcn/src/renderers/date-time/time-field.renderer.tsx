import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TimeFieldView } from "@statewalker/workbench-views";

export function TimeFieldRenderer({ model }: { model: TimeFieldView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Date/time time-field placeholder</div>;
}
