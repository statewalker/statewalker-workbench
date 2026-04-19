import { LogicButton } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { LogicButtonView } from "@statewalker/shared-views";

export function LogicButtonRenderer({ model }: { model: LogicButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <LogicButton variant={model.logicVariant} onPress={() => model.toggle()} />
  );
}
