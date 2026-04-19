import { ActionButton } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ActionButtonView } from "@statewalker/shared-views";

export function ActionButtonRenderer({ model }: { model: ActionButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionButton
      isQuiet={model.isQuiet}
      isDisabled={model.action.disabled}
      staticColor={model.staticColor}
      onPress={() => model.action.submit()}
    >
      {model.action.label}
    </ActionButton>
  );
}
