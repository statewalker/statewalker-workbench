import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { CheckboxView } from "@statewalker/workbench-views";

export function CheckboxRenderer({ model }: { model: CheckboxView }) {
  useUpdates(model.onUpdate);

  return (
    <label
      className={`inline-flex items-center gap-2 ${model.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={model.isSelected}
        disabled={model.isDisabled}
        readOnly={model.isReadOnly}
        ref={(el) => {
          if (el) el.indeterminate = model.isIndeterminate;
        }}
        onChange={() => model.toggle()}
        className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
      />
      <span className="text-sm">{model.label}</span>
    </label>
  );
}
