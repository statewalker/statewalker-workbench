import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { EmptyView } from "@statewalker/shared-views";

export function EmptyRenderer({ model }: { model: EmptyView }) {
  useUpdates(model.onUpdate);
  return (
    <IllustratedMessage>
      <Heading>{model.heading}</Heading>
      {model.description && <Content>{model.description}</Content>}
    </IllustratedMessage>
  );
}
