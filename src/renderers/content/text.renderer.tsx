import { Text } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { TextView } from "@repo/shared-views";

export function TextRenderer({ model }: { model: TextView }) {
  useUpdates(model.onUpdate);
  return <Text>{model.text}</Text>;
}
