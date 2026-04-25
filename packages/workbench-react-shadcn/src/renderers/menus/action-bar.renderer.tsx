import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ActionBarView } from "@statewalker/workbench-views";
import { ActionButton } from "../actions/action-button.renderer.js";

export function ActionBarRenderer({ model }: { model: ActionBarView }) {
  useUpdates(model.onUpdate);

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-border bg-card p-2 ${
        model.isEmphasized ? "bg-accent" : ""
      }`}
      role="toolbar"
    >
      {model.selectedItemCount > 0 && (
        <span className="text-sm text-muted-foreground mr-2">
          {model.selectedItemCount} selected
        </span>
      )}
      {model.children.map((action) => (
        <ActionButton key={action.actionKey} action={action} />
      ))}
    </div>
  );
}
