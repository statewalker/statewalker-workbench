import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { RangeCalendarView } from "@statewalker/workbench-views";

export function RangeCalendarRenderer({ model }: { model: RangeCalendarView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">Date/time range-calendar placeholder</div>
  );
}
