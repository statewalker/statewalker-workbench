import { Badge } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { BadgeView } from "@statewalker/shared-views";

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);
  return (
    <Badge variant={model.variant === "informative" ? "info" : model.variant}>
      {model.label}
    </Badge>
  );
}
