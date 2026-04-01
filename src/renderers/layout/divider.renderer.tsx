import { Divider } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { DividerView } from "@repo/shared-views";

export function DividerRenderer({ model }: { model: DividerView }) {
  useUpdates(model.onUpdate);
  return <Divider orientation={model.orientation} size={model.size} />;
}
