import { useUpdates } from "@statewalker/shared-react/hooks";
import type { DateRangePickerView } from "@statewalker/shared-views";

export function DateRangePickerRenderer({ model }: { model: DateRangePickerView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">Date/time date-range-picker placeholder</div>
  );
}
