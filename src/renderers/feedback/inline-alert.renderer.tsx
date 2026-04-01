import { Content, Heading, InlineAlert } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { InlineAlertView } from "@repo/shared-views";
import { RenderSlot } from "../_shared/render-slot.js";

export function InlineAlertRenderer({ model }: { model: InlineAlertView }) {
  useUpdates(model.onUpdate);
  return (
    <InlineAlert
      variant={model.variant === "informative" ? "info" : model.variant}
    >
      {model.header && <Heading>{model.header}</Heading>}
      <Content>
        <RenderSlot value={model.content} />
      </Content>
    </InlineAlert>
  );
}
