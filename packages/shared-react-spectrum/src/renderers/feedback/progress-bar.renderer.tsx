import { ProgressBar } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ProgressBarView } from "@statewalker/shared-views";

export function ProgressBarRenderer({ model }: { model: ProgressBarView }) {
  useUpdates(model.onUpdate);
  return (
    <ProgressBar
      label={model.label}
      value={model.value ?? undefined}
      minValue={model.minValue}
      maxValue={model.maxValue}
      size={model.size === "M" ? "S" : model.size}
      labelPosition={model.labelPosition}
      showValueLabel={model.showValueLabel}
      variant={model.variant}
      isIndeterminate={model.isIndeterminate}
    />
  );
}
