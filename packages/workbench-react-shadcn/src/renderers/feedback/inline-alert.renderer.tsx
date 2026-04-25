import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { InlineAlertView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

const variantClasses: Record<string, string> = {
  informative:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
  positive:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  notice:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  negative:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

export function InlineAlertRenderer({ model }: { model: InlineAlertView }) {
  useUpdates(model.onUpdate);

  const variantClass = variantClasses[model.variant] ?? variantClasses.informative;

  return (
    <div className={`rounded-lg border p-4 ${variantClass}`} role="alert">
      {model.header && <h4 className="mb-1 font-semibold">{model.header}</h4>}
      <div className="text-sm">
        {typeof model.content === "string" ? model.content : <RenderModel model={model.content} />}
      </div>
    </div>
  );
}
