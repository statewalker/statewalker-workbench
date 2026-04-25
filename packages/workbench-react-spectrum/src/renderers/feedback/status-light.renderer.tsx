import { StatusLight } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { StatusLightView } from "@statewalker/workbench-views";

export function StatusLightRenderer({ model }: { model: StatusLightView }) {
  useUpdates(model.onUpdate);
  return <StatusLight variant={model.variant}>{model.label}</StatusLight>;
}
