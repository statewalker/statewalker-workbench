import { useUpdates } from "@repo/shared-react/hooks";
import type { DialogView as DialogViewType } from "@repo/shared-views";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog.js";
import { RenderModel } from "../_shared/render-slot.js";

export function DialogRenderer({ model }: { model: DialogViewType }) {
  useUpdates(model.onUpdate);

  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {typeof model.header === "string" ? model.header : "Dialog"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {typeof model.header === "string" ? model.header : ""}
          </DialogDescription>
        </DialogHeader>

        <div>
          {model.children.map((child) => (
            <RenderModel key={child.key} model={child} />
          ))}
        </div>

        {model.footer && (
          <DialogFooter>
            {typeof model.footer === "string" ? (
              model.footer
            ) : (
              <RenderModel model={model.footer} />
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
