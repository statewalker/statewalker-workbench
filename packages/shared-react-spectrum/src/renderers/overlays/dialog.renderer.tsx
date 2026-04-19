import { Content, Dialog, Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { DialogView } from "@statewalker/shared-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

export function DialogRenderer({ model }: { model: DialogView }) {
  useUpdates(model.onUpdate);
  return (
    <Dialog size={model.size} isDismissable={model.isDismissable}>
      {model.header && (
        <Heading>
          <RenderSlot value={model.header} />
        </Heading>
      )}
      <Content>
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </Content>
      {model.footer && <RenderSlot value={model.footer} />}
    </Dialog>
  );
}
