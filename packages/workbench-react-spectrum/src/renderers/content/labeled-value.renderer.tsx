import { LabeledValue } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { LabeledValueView } from "@statewalker/workbench-views";

export function LabeledValueRenderer({ model }: { model: LabeledValueView }) {
  useUpdates(model.onUpdate);
  return <LabeledValue label={model.label} value={String(model.value)} />;
}
