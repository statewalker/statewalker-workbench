import { TimeField } from "@adobe/react-spectrum";
import { parseTime } from "@internationalized/date";
import { useUpdates } from "@repo/shared-react/hooks";
import type { TimeFieldView } from "@repo/shared-views";

export function TimeFieldRenderer({ model }: { model: TimeFieldView }) {
  useUpdates(model.onUpdate);
  let value;
  try {
    value = model.value ? parseTime(model.value) : undefined;
  } catch {
    value = undefined;
  }
  return (
    <TimeField
      label={model.label}
      value={value}
      granularity={model.granularity}
      hourCycle={model.hourCycle}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isRequired={model.isRequired}
      errorMessage={model.errorMessage}
      onChange={(time) => {
        model.value = time?.toString();
      }}
    />
  );
}
