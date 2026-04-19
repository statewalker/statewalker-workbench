import { Meter } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { MeterView } from "@statewalker/shared-views";

export function MeterRenderer({ model }: { model: MeterView }) {
  useUpdates(model.onUpdate);
  return (
    <Meter
      label={model.label}
      value={model.value}
      minValue={model.minValue}
      maxValue={model.maxValue}
      size={model.size === "M" ? "S" : model.size}
      variant={model.variant}
    />
  );
}
