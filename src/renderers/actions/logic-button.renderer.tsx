import { LogicButton } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { LogicButtonView } from "@repo/shared-views";

export function LogicButtonRenderer({ model }: { model: LogicButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <LogicButton variant={model.logicVariant} onPress={() => model.toggle()} />
  );
}
