import { useUpdates } from "@repo/shared-react/hooks";
import type { DateFieldView } from "@repo/shared-views";

export function DateFieldRenderer({ model }: { model: DateFieldView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Date/time date-field placeholder
    </div>
  );
}
