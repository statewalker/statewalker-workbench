import { Button, type SpectrumButtonProps } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ButtonVariant, ButtonView } from "@statewalker/workbench-views";

const variantMap: Record<ButtonVariant, SpectrumButtonProps["variant"]> = {
  primary: "accent",
  secondary: "secondary",
  tertiary: "primary",
  danger: "negative",
};

export function ButtonRenderer({ model }: { model: ButtonView }) {
  useUpdates(model.onUpdate);
  useUpdates(model.action.onUpdate);
  return (
    <Button
      variant={variantMap[model.variant]}
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
