import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { EmptyView as EmptyViewType } from "@statewalker/workbench-views";
import { ActionButton } from "../actions/action-button.renderer.js";

export function EmptyRenderer({ model }: { model: EmptyViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
      <div className="flex flex-col items-center max-w-[50em] w-full">
        {model.icon && <Icon name={model.icon} className="mb-3 size-12 opacity-50" />}
        <h3 className="text-lg font-medium">{model.heading}</h3>
        {model.description && <p className="mt-1 text-sm">{model.description}</p>}
        {model.action && (
          <div className="mt-4">
            <ActionButton action={model.action} />
          </div>
        )}
      </div>
    </div>
  );
}
