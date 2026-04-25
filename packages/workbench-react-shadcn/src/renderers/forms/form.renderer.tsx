import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { FormView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function FormRenderer({ model }: { model: FormView }) {
  useUpdates(model.onUpdate);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <fieldset disabled={model.isDisabled} className="flex flex-col gap-4">
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </fieldset>
    </form>
  );
}
