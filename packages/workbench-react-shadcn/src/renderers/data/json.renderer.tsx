import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { JsonView as JsonViewType } from "@statewalker/workbench-views";

export function JsonRenderer({ model }: { model: JsonViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div className="p-4">
      {model.label && (
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">{model.label}</h3>
      )}
      <pre className="text-sm bg-muted rounded-md p-3 overflow-auto max-h-64 whitespace-pre-wrap">
        {JSON.stringify(model.data, null, 2)}
      </pre>
    </div>
  );
}
