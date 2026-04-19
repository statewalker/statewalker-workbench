import { Divider } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { DividerView } from "@statewalker/shared-views";

export function DividerRenderer({ model }: { model: DividerView }) {
  useUpdates(model.onUpdate);
  return <Divider orientation={model.orientation} size={model.size} />;
}
