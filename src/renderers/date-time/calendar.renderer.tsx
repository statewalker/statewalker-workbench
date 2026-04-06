import { useUpdates } from "@repo/shared-react/hooks";
import type { CalendarView } from "@repo/shared-views";

export function CalendarRenderer({ model }: { model: CalendarView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Date/time calendar placeholder
    </div>
  );
}
