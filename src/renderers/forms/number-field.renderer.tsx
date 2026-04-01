import { NumberField } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { NumberFieldView } from "@repo/shared-views";

export function NumberFieldRenderer({ model }: { model: NumberFieldView }) {
  useUpdates(model.onUpdate);
  return (
    <NumberField
      label={model.label}
      value={model.value ?? undefined}
      minValue={model.minValue}
      maxValue={model.maxValue}
      step={model.step}
      formatOptions={model.formatOptions}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      errorMessage={model.errorMessage}
      description={model.description}
      onChange={(v) => {
        model.value = v;
      }}
    />
  );
}
