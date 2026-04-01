import { Meter } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { MeterView } from "@repo/shared-views";

export function MeterRenderer({ model }: { model: MeterView }) {
  useUpdates(model.onUpdate);
  return (
    <Meter
      label={model.label}
      value={model.value}
      minValue={model.minValue}
      maxValue={model.maxValue}
      size={model.size}
      variant={model.variant}
    />
  );
}
