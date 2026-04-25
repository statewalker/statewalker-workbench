import { Badge } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { BadgeView } from "@statewalker/workbench-views";

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);
  return (
    <Badge variant={model.variant === "informative" ? "info" : model.variant}>{model.label}</Badge>
  );
}
