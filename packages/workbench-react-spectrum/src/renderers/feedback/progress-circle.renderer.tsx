import { ProgressCircle } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ProgressCircleView } from "@statewalker/workbench-views";

export function ProgressCircleRenderer({ model }: { model: ProgressCircleView }) {
  useUpdates(model.onUpdate);
  return (
    <ProgressCircle
      value={model.value ?? undefined}
      minValue={model.minValue}
      maxValue={model.maxValue}
      size={model.size}
      variant={model.variant}
      isIndeterminate={model.isIndeterminate}
    />
  );
}
