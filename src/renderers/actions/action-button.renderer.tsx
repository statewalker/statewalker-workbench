import { ActionButton } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ActionButtonView } from "@repo/shared-views";

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
