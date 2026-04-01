import { Badge } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { BadgeView } from "@repo/shared-views";

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);
  return <Badge variant={model.variant as any}>{model.label}</Badge>;
}
