import { DatePicker } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@repo/shared-react/hooks";
import type { DatePickerView } from "@repo/shared-views";

export function DatePickerRenderer({ model }: { model: DatePickerView }) {
  useUpdates(model.onUpdate);
  let value;
  try {
    value = model.value ? parseDate(model.value) : undefined;
  } catch {
    value = undefined;
  }
  return (
    <DatePicker
      label={model.label}
      value={value}
      granularity={model.granularity}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isRequired={model.isRequired}
      errorMessage={model.errorMessage}
      description={model.description}
      isOpen={model.isOpen}
      onChange={(date) => {
        model.value = date?.toString();
      }}
      onOpenChange={(open) => {
        model.isOpen = open;
      }}
    />
  );
}
