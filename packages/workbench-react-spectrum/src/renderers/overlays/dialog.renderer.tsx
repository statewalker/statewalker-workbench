import { Content, Dialog, Heading } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DialogView } from "@statewalker/workbench-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

// `DialogView.size` accepts arbitrary CSS sizes plus the workbench presets;
// Spectrum's `Dialog` only knows S/M/L. Map the presets, fall back to M.
const sizeMap: Record<string, "S" | "M" | "L"> = {
  xs: "S",
  sm: "S",
  md: "M",
  lg: "L",
  xl: "L",
};

export function DialogRenderer({ model }: { model: DialogView }) {
  useUpdates(model.onUpdate);
  return (
    <Dialog size={sizeMap[model.size] ?? "M"} isDismissable={model.isDismissable}>
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
