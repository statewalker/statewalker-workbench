import { LabeledValue } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { LabeledValueView } from "@statewalker/shared-views";

export function LabeledValueRenderer({ model }: { model: LabeledValueView }) {
  useUpdates(model.onUpdate);
  return <LabeledValue label={model.label} value={String(model.value)} />;
}
