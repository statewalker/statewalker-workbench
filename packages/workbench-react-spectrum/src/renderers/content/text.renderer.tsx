import { Text } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TextView } from "@statewalker/workbench-views";

export function TextRenderer({ model }: { model: TextView }) {
  useUpdates(model.onUpdate);
  return <Text>{model.text}</Text>;
}
