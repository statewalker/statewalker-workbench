import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ContentPanelView } from "@statewalker/shared-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

export function ContentPanelRenderer({ model }: { model: ContentPanelView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col">
      {model.header && (
        <div className="border-b border-border px-4 py-3 font-semibold">
          {typeof model.header === "string" ? model.header : <RenderSlot value={model.header} />}
        </div>
      )}
      <div className="p-4">
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </div>
      {model.footer && (
        <div className="border-t border-border px-4 py-3">
          {typeof model.footer === "string" ? model.footer : <RenderSlot value={model.footer} />}
        </div>
      )}
    </div>
  );
}
