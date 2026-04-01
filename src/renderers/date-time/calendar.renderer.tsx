import { Calendar } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@repo/shared-react/hooks";
import type { CalendarView } from "@repo/shared-views";

export function CalendarRenderer({ model }: { model: CalendarView }) {
  useUpdates(model.onUpdate);
  let value;
  try {
    value = model.value ? parseDate(model.value) : undefined;
  } catch {
    value = undefined;
  }
  return (
    <Calendar
      value={value}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      onChange={(date) => {
        model.value = date.toString();
      }}
    />
  );
}
