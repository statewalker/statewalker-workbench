import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ButtonSize, ButtonVariant, ButtonView } from "@statewalker/workbench-views";
import { Button, type ButtonProps } from "../../components/index.js";

const variantMap: Record<ButtonVariant, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
};

const sizeMap: Record<ButtonSize, ButtonProps["size"]> = {
  S: "sm",
  M: "default",
  L: "lg",
  XL: "lg",
};

export function ButtonRenderer({ model }: { model: ButtonView }) {
  useUpdates(model.onUpdate);
  useUpdates(model.action.onUpdate);

  return (
    <Button
      type={model.type}
      variant={variantMap[model.variant]}
      size={sizeMap[model.size]}
      disabled={model.action.disabled || model.isPending}
      onClick={() => model.action.submit()}
    >
      {model.isPending && (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {!model.isPending && model.action.icon && (
        <Icon name={model.action.icon} className="size-4" />
      )}
      {model.action.label ?? model.action.actionKey}
    </Button>
  );
}
