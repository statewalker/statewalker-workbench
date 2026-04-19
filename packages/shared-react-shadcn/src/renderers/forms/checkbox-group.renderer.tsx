import { useUpdates } from "@statewalker/shared-react/hooks";
import type { CheckboxGroupView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function CheckboxGroupRenderer({ model }: { model: CheckboxGroupView }) {
  useUpdates(model.onUpdate);

  return (
    <fieldset disabled={model.isDisabled} className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium">
        {model.label}
        {model.isRequired && <span className="text-destructive ml-1">*</span>}
      </legend>
      <div
        className={`flex gap-3 ${model.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`}
      >
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </div>
      {model.errorMessage && <p className="text-xs text-destructive">{model.errorMessage}</p>}
    </fieldset>
  );
}
