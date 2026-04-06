import { useUpdates } from "@repo/shared-react/hooks";
import type { RangeCalendarView } from "@repo/shared-views";

export function RangeCalendarRenderer({ model }: { model: RangeCalendarView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Date/time range-calendar placeholder
    </div>
  );
}
