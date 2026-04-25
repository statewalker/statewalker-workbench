import { useUpdates } from "@statewalker/workbench-react/hooks";
import type {
  ActionButtonView,
  ActionView,
  ActionViewVariant,
} from "@statewalker/workbench-views";
import { Button, type ButtonProps } from "../../components/index.js";

const variantMap: Record<ActionViewVariant, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "secondary",
  neutral: "outline",
  danger: "destructive",
  info: "ghost",
};

/**
 * Lightweight helper for rendering a bare `ActionView`. Used internally
 * by toolbar / toast / menu renderers; not the registry-bound renderer
 * for `ActionButtonView` (see `ActionButtonRenderer` below).
 */
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

const sizeMap: Record<string, ButtonProps["size"]> = {
  XS: "sm",
  S: "sm",
  M: "default",
  L: "lg",
  XL: "lg",
};

/**
 * Registry-bound renderer for `ActionButtonView`. Maps `isQuiet` to
 * the shadcn ghost variant, the action's variant to the shadcn variant,
 * and the model's size to the shadcn size token. `staticColor` is a
 * Spectrum-only concept and is ignored on this side.
 */
export function ActionButtonRenderer({ model }: { model: ActionButtonView }) {
  useUpdates(model.onUpdate);
  const action = model.action;
  useUpdates(action.onUpdate);
  return (
    <Button
      variant={model.isQuiet ? "ghost" : variantMap[action.variant]}
      size={sizeMap[model.size] ?? "default"}
      disabled={action.disabled}
      onClick={() => action.submit()}
    >
      {action.label ?? action.actionKey}
    </Button>
  );
}
