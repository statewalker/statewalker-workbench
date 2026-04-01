import { Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { HeadingView } from "@repo/shared-views";

export function HeadingRenderer({ model }: { model: HeadingView }) {
  useUpdates(model.onUpdate);
  return <Heading level={model.level}>{model.text}</Heading>;
}
