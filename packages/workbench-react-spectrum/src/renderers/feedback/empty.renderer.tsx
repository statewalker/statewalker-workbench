import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { EmptyView } from "@statewalker/workbench-views";

export function EmptyRenderer({ model }: { model: EmptyView }) {
  useUpdates(model.onUpdate);
  return (
    <IllustratedMessage>
      <Heading>{model.heading}</Heading>
      {model.description && <Content>{model.description}</Content>}
    </IllustratedMessage>
  );
}
