import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DatePickerView } from "@statewalker/workbench-views";

export function DatePickerRenderer({ model }: { model: DatePickerView }) {
  useUpdates(model.onUpdate);
  return <div className="p-2 text-sm text-muted-foreground">Date/time date-picker placeholder</div>;
}
