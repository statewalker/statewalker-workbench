import { useUpdates } from "@statewalker/shared-react/hooks";
import type { PickerView } from "@statewalker/shared-views";

export function PickerRenderer({ model }: { model: PickerView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5">
      {model.label && (
        <label className="text-sm font-medium">
          {model.label}
          {model.isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <select
        value={model.selectedKey ?? ""}
        disabled={model.isDisabled}
        onChange={(e) => model.setSelectedKey(e.target.value || undefined)}
        className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${model.errorMessage ? "border-destructive" : "border-input"}`}
      >
        {model.placeholder && (
          <option value="" disabled>
            {model.placeholder}
          </option>
        )}
        {model.items.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>
      {model.errorMessage && (
        <p className="text-xs text-destructive">{model.errorMessage}</p>
      )}
    </div>
  );
}
