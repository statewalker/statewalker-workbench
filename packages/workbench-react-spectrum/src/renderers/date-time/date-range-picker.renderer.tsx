import { DateRangePicker } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DateRangePickerView } from "@statewalker/workbench-views";

export function DateRangePickerRenderer({ model }: { model: DateRangePickerView }) {
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
    <DateRangePicker
      label={model.label}
      value={value}
      granularity={model.granularity}
      isDisabled={model.isDisabled}
      isOpen={model.isOpen}
      onChange={(range) => {
        if (range) {
          model.setRange(range.start.toString(), range.end.toString());
        }
      }}
      onOpenChange={(open) => {
        model.isOpen = open;
      }}
    />
  );
}
