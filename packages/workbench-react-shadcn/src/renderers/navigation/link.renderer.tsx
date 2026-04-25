import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { LinkView } from "@statewalker/workbench-views";

const variantClasses: Record<string, string> = {
  primary: "text-primary underline-offset-4 hover:underline",
  secondary: "text-secondary-foreground underline-offset-4 hover:underline",
  overBackground: "text-primary-foreground underline-offset-4 hover:underline",
};

export function LinkRenderer({ model }: { model: LinkView }) {
  useUpdates(model.onUpdate);

  const variantClass = variantClasses[model.variant] ?? variantClasses.primary;

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        model.action.submit();
      }}
      className={`inline-flex items-center text-sm font-medium transition-colors
        ${variantClass}
        ${model.isQuiet ? "no-underline" : ""}
        ${model.action.disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
    >
      {model.action.label ?? model.action.actionKey}
    </a>
  );
}
