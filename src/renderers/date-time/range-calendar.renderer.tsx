import { RangeCalendar } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@repo/shared-react/hooks";
import type { RangeCalendarView } from "@repo/shared-views";

export function RangeCalendarRenderer({ model }: { model: RangeCalendarView }) {
  useUpdates(model.onUpdate);
  let value;
  try {
    if (model.startValue && model.endValue) {
      value = {
        start: parseDate(model.startValue),
        end: parseDate(model.endValue),
      };
    }
  } catch {
    value = undefined;
  }
  return (
    <RangeCalendar
      value={value}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      onChange={(range) => {
        if (range) {
          model.setRange(range.start.toString(), range.end.toString());
        }
      }}
    />
  );
}
