import { useUpdates } from "@repo/shared-react/hooks";
import type { SheetSide, SheetView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";
import { ActionButton } from "../actions/action-button.renderer.js";

const sideClasses: Record<SheetSide, string> = {
  left: "inset-y-0 left-0 w-80 border-r",
  right: "inset-y-0 right-0 w-80 border-l",
  top: "inset-x-0 top-0 h-80 border-b",
  bottom: "inset-x-0 bottom-0 h-80 border-t",
};

const slideIn: Record<SheetSide, string> = {
  left: "translate-x-0",
  right: "translate-x-0",
  top: "translate-y-0",
  bottom: "translate-y-0",
};

const slideOut: Record<SheetSide, string> = {
  left: "-translate-x-full",
  right: "translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

export function SheetRenderer({ model }: { model: SheetView }) {
  useUpdates(model.onUpdate);

  if (!model.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => model.setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") model.setOpen(false);
        }}
      />
      <div
        className={`fixed z-50 bg-card border-border ${sideClasses[model.side]} ${
          model.isOpen ? slideIn[model.side] : slideOut[model.side]
        } transition-transform duration-200 flex flex-col`}
      >
        {(model.content as any) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-lg font-semibold">{model.content as any}</h3>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => model.setOpen(false)}
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">
          {model.content && <RenderModel model={model.content} />}
        </div>
        {(model as any).actions.length > 0 && (
          <div className="flex justify-end gap-2 border-t border-border p-4">
            {(model as any).actions.map((action: any) => (
              <ActionButton key={action.actionKey} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
