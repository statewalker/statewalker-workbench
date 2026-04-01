import { AlertDialog } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { AlertDialogView } from "@repo/shared-views";

export function AlertDialogRenderer({ model }: { model: AlertDialogView }) {
  useUpdates(model.onUpdate);
  return (
    <AlertDialog
      variant={model.variant}
      title={typeof model.header === "string" ? model.header : "Alert"}
      primaryActionLabel={model.primaryAction.label ?? "OK"}
      secondaryActionLabel={model.secondaryAction?.label}
      cancelLabel={model.cancelAction?.label}
      onPrimaryAction={() => model.primaryAction.submit()}
      onSecondaryAction={() => model.secondaryAction?.submit()}
      onCancel={() => model.cancelAction?.submit()}
    />
  );
}
