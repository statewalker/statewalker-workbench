import { useUpdates } from "@repo/shared-react/hooks";
import type { ActionGroupView } from "@repo/shared-views";
import { cn } from "../../lib/utils.js";
import { Button } from "../../components/ui/button.js";

export function ActionGroupRenderer({ model }: { model: ActionGroupView }) {
  useUpdates(model.onUpdate);

  const isVertical = model.orientation === "vertical";
  const isCompact = model.density === "compact";

  return (
    <div
      role="group"
      className={cn(
        "inline-flex",
        isVertical ? "flex-col" : "flex-row",
        isCompact ? "gap-0" : "gap-1",
        isCompact && !isVertical && "[&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none",
        isCompact && isVertical && "[&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none",
      )}
    >
      {model.children.map((action) => (
        <Button
          key={action.actionKey}
          variant={action.variant === "primary" ? "default" : action.variant === "danger" ? "destructive" : "outline"}
          size={model.size === "S" || model.size === "XS" ? "sm" : model.size === "L" || model.size === "XL" ? "lg" : "default"}
          disabled={action.disabled || model.disabledKeys.has(action.actionKey)}
          onClick={() => action.submit()}
        >
          {action.label ?? action.actionKey}
        </Button>
      ))}
    </div>
  );
}
