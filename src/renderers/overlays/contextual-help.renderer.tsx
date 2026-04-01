import { Content, ContextualHelp, Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ContextualHelpView } from "@repo/shared-views";
import { RenderSlot } from "../_shared/render-slot.js";

export function ContextualHelpRenderer({
  model,
}: {
  model: ContextualHelpView;
}) {
  useUpdates(model.onUpdate);
  return (
    <ContextualHelp variant={model.variant}>
      {model.title && <Heading>{model.title}</Heading>}
      <Content>
        <RenderSlot value={model.content} />
      </Content>
    </ContextualHelp>
  );
}
