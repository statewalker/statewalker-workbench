import { Button } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ButtonView } from "@statewalker/workbench-views";

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
      {model.action.icon && <Icon name={model.action.icon} className="w-[16px] h-[16px] mr-1" />}
      {model.action.label}
    </Button>
  );
}
