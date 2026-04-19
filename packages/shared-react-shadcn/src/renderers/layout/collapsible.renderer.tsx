import { useUpdates } from "@statewalker/shared-react/hooks";
import type { CollapsibleView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function CollapsibleRenderer({ model }: { model: CollapsibleView }) {
  useUpdates(model.onUpdate);

  return (
    <div>
      <button
        type="button"
        onClick={() => model.toggle()}
        disabled={model.trigger.disabled}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
      >
        {model.trigger.label ?? "Toggle"}
        <span
          className={`ml-2 transition-transform ${model.isOpen ? "rotate-180" : ""}`}
        >
          &#9662;
        </span>
      </button>
      {model.isOpen && (
        <div className="px-3 py-2">
          {model.children.map((child) => (
            <RenderModel key={child.key} model={child} />
          ))}
        </div>
      )}
    </div>
  );
}
