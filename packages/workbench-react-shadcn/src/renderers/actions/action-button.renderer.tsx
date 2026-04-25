import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ActionView, ActionViewVariant } from "@statewalker/workbench-views";
import { Button, type ButtonProps } from "../../components/index.js";

const variantMap: Record<ActionViewVariant, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "secondary",
  neutral: "outline",
  danger: "destructive",
  info: "ghost",
};

export function ActionButton({ action, tooltip }: { action: ActionView; tooltip?: string }) {
  useUpdates(action.onUpdate);

  return (
    <Button
      variant={variantMap[action.variant]}
      onClick={() => action.submit()}
      disabled={action.disabled}
      title={tooltip}
    >
      {action.label ?? action.actionKey}
    </Button>
  );
}
