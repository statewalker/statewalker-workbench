import { LabeledValue } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { LabeledValueView } from "@repo/shared-views";

export function LabeledValueRenderer({ model }: { model: LabeledValueView }) {
  useUpdates(model.onUpdate);
  return (
    <LabeledValue
      label={model.label}
      value={model.value}
      formatOptions={model.formatOptions}
    />
  );
}
