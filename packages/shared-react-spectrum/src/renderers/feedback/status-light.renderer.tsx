import { StatusLight } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { StatusLightView } from "@statewalker/shared-views";

export function StatusLightRenderer({ model }: { model: StatusLightView }) {
  useUpdates(model.onUpdate);
  return <StatusLight variant={model.variant}>{model.label}</StatusLight>;
}
