import { useUpdates } from "@repo/shared-react/hooks";
import type { PopoverView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function PopoverRenderer({ model }: { model: PopoverView }) {
  useUpdates(model.onUpdate);

  if (!model.isOpen) return null;

  return (
    <div
      className="z-50 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none"
      style={{
        marginTop: model.offset,
        marginLeft: model.crossOffset,
      }}
    >
      <RenderModel model={model.content} />
    </div>
  );
}
