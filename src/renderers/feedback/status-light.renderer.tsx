import { StatusLight } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { StatusLightView } from "@repo/shared-views";

export function StatusLightRenderer({ model }: { model: StatusLightView }) {
  useUpdates(model.onUpdate);
  return <StatusLight variant={model.variant}>{model.label}</StatusLight>;
}
