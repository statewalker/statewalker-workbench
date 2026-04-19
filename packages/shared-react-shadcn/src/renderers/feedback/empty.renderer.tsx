import { useUpdates } from "@statewalker/shared-react/hooks";
import type { EmptyView as EmptyViewType } from "@statewalker/shared-views";
import { ActionButton } from "../actions/action-button.renderer.js";

export function EmptyRenderer({ model }: { model: EmptyViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      {model.icon && <span className="mb-3 text-4xl opacity-50">{model.icon}</span>}
      <h3 className="text-lg font-medium">{model.heading}</h3>
      {model.description && <p className="mt-1 text-sm">{model.description}</p>}
      {model.action && (
        <div className="mt-4">
          <ActionButton action={model.action} />
        </div>
      )}
    </div>
  );
}
