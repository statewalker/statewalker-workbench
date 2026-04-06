import { useUpdates } from "@repo/shared-react/hooks";
import type { TimeFieldView } from "@repo/shared-views";

export function TimeFieldRenderer({ model }: { model: TimeFieldView }) {
  useUpdates(model.onUpdate);
  return (
    <div className="p-2 text-sm text-muted-foreground">
      Date/time time-field placeholder
    </div>
  );
}
