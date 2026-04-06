import { useUpdates } from "@repo/shared-react/hooks";
import type { DatePickerView } from "@repo/shared-views";

export function DatePickerRenderer({ model }: { model: DatePickerView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Date/time date-picker placeholder
    </div>
  );
}
