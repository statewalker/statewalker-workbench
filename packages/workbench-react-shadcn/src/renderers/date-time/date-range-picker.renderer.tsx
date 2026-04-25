import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DateRangePickerView } from "@statewalker/workbench-views";

export function DateRangePickerRenderer({ model }: { model: DateRangePickerView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">Date/time date-range-picker placeholder</div>
  );
}
