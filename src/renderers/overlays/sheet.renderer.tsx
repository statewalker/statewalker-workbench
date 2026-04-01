import { Content, Dialog } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { SheetView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function SheetRenderer({ model }: { model: SheetView }) {
  useUpdates(model.onUpdate);
  return (
    <Dialog isDismissable={model.isDismissable}>
      <Content>
        {model.content && <RenderModel model={model.content} />}
      </Content>
    </Dialog>
  );
}
