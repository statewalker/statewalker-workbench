import { RangeCalendar } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { RangeCalendarView } from "@statewalker/workbench-views";

export function RangeCalendarRenderer({ model }: { model: RangeCalendarView }) {
  useUpdates(model.onUpdate);
  let value: { start: ReturnType<typeof parseDate>; end: ReturnType<typeof parseDate> } | undefined;
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
