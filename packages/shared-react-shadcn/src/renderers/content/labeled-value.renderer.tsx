import { useUpdates } from "@statewalker/shared-react/hooks";
import type { LabeledValueView } from "@statewalker/shared-views";

export function LabeledValueRenderer({ model }: { model: LabeledValueView }) {
  useUpdates(model.onUpdate);

  const formatted =
    typeof model.value === "number" && model.formatOptions
      ? new Intl.NumberFormat(undefined, model.formatOptions).format(
          model.value,
        )
      : String(model.value);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-muted-foreground">{model.label}</span>
      <span className="text-sm font-medium">{formatted}</span>
    </div>
  );
}
