import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { DialogView } from "@statewalker/workbench-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

/**
 * Inline renderer for `DialogView` — produces the dialog's header /
 * children / footer as plain blocks. The AppShell's `<DialogOverlay>`
 * already handles modal stacking via `getDialogStackView`; this
 * renderer is for embedding a dialog's content inline (e.g. as a
 * panel body or a card content). Mirrors the spectrum
 * `DialogRenderer` shape.
 */
export function DialogRenderer({ model }: { model: DialogView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="flex flex-col gap-3">
      {model.header && (
        <div className="text-base font-semibold">
          <RenderSlot value={model.header} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </div>
      {model.footer && (
        <div className="text-sm text-muted-foreground">
          <RenderSlot value={model.footer} />
        </div>
      )}
    </div>
  );
}
