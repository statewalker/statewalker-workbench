import { Button } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ButtonView } from "@statewalker/shared-views";

export function ButtonRenderer({ model }: { model: ButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <Button
      variant={
        model.action.variant === "danger"
          ? "negative"
          : model.action.variant === "primary"
            ? "accent"
            : "secondary"
      }
      isPending={model.isPending}
      isDisabled={model.action.disabled}
      staticColor={model.staticColor}
      onPress={() => model.action.submit()}
    >
      {model.action.label}
    </Button>
  );
}
