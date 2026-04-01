import { DateField } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { useUpdates } from "@repo/shared-react/hooks";
import type { DateFieldView } from "@repo/shared-views";

export function DateFieldRenderer({ model }: { model: DateFieldView }) {
  useUpdates(model.onUpdate);
  let value;
  try {
    value = model.value ? parseDate(model.value) : undefined;
  } catch {
    value = undefined;
  }
  return (
    <DateField
      label={model.label}
      value={value}
      granularity={model.granularity}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isRequired={model.isRequired}
      errorMessage={model.errorMessage}
      description={model.description}
      onChange={(date) => {
        model.value = date?.toString();
      }}
    />
  );
}
