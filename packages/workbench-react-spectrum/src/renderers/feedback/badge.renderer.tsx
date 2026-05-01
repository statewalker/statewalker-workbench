import { Badge } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { BadgeView } from "@statewalker/workbench-views";

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);
  return (
    <Badge variant={model.variant === "informative" ? "info" : model.variant}>
      {model.icon && <Icon name={model.icon} className="w-[12px] h-[12px] mr-1" />}
      {model.label}
    </Badge>
  );
}
