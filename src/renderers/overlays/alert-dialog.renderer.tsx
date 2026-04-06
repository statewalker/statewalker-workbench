import { useUpdates } from "@repo/shared-react/hooks";
import type { AlertDialogView } from "@repo/shared-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";
import { ActionButton } from "../actions/action-button.renderer.js";

export function AlertDialogRenderer({ model }: { model: AlertDialogView }) {
  useUpdates(model.onUpdate);

  if (!model.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-50 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        {model.header && (
          <h2 className="text-lg font-semibold mb-2">
            {typeof model.header === "string" ? (
              model.header
            ) : (
              <RenderSlot value={model.header} />
            )}
          </h2>
        )}
        <div className="text-sm text-muted-foreground mb-4">
          {model.children.map((child) => (
            <RenderModel key={child.key} model={child} />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          {model.cancelAction && <ActionButton action={model.cancelAction} />}
          {model.secondaryAction && (
            <ActionButton action={model.secondaryAction} />
          )}
          <ActionButton action={model.primaryAction} />
        </div>
      </div>
    </div>
  );
}
