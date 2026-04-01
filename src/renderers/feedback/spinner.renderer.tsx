import { ProgressCircle } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { SpinnerView } from "@repo/shared-views";

export function SpinnerRenderer({ model }: { model: SpinnerView }) {
  useUpdates(model.onUpdate);
  return (
    <ProgressCircle
      aria-label={model.label ?? "Loading"}
      isIndeterminate
      size={model.size}
    />
  );
}
