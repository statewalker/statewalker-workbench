import { Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { HeadingView } from "@statewalker/shared-views";

export function HeadingRenderer({ model }: { model: HeadingView }) {
  useUpdates(model.onUpdate);
  return <Heading level={model.level}>{model.text}</Heading>;
}
