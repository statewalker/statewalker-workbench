import { Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { HeadingView } from "@statewalker/workbench-views";

export function HeadingRenderer({ model }: { model: HeadingView }) {
  useUpdates(model.onUpdate);
  return <Heading level={model.level}>{model.text}</Heading>;
}
