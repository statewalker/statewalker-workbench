import { ActionButton } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ActionButtonView } from "@statewalker/workbench-views";

export function ActionButtonRenderer({ model }: { model: ActionButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionButton
      isQuiet={model.isQuiet}
      isDisabled={model.action.disabled}
      staticColor={model.staticColor}
      onPress={() => model.action.submit()}
    >
      {model.action.icon && <Icon name={model.action.icon} className="w-[16px] h-[16px] mr-1" />}
      {model.action.label}
    </ActionButton>
  );
}
