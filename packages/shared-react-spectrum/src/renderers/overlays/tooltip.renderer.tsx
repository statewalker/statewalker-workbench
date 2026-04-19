import { Tooltip } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TooltipView } from "@statewalker/shared-views";
import { RenderSlot } from "../_shared/render-slot.js";

export function TooltipRenderer({ model }: { model: TooltipView }) {
  useUpdates(model.onUpdate);
  return (
    <Tooltip variant={model.variant} placement={model.placement}>
      <RenderSlot value={model.content} />
    </Tooltip>
  );
}
