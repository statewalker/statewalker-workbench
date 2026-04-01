import { Content, Dialog } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { PopoverView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function PopoverRenderer({ model }: { model: PopoverView }) {
  useUpdates(model.onUpdate);
  return (
    <Dialog>
      <Content>
        <RenderModel model={model.content} />
      </Content>
    </Dialog>
  );
}
