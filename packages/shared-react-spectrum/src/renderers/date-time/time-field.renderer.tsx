import { TimeField } from "@adobe/react-spectrum";
import { parseTime } from "@internationalized/date";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TimeFieldView } from "@statewalker/shared-views";

export function TimeFieldRenderer({ model }: { model: TimeFieldView }) {
  useUpdates(model.onUpdate);
  let value: ReturnType<typeof parseTime> | undefined;
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
