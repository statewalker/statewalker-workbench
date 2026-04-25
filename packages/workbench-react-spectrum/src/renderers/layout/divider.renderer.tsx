import { Divider } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DividerView } from "@statewalker/workbench-views";

export function DividerRenderer({ model }: { model: DividerView }) {
  useUpdates(model.onUpdate);
  return <Divider orientation={model.orientation} size={model.size} />;
}
