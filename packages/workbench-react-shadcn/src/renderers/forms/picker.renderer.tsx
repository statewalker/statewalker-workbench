import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { PickerItem, PickerView } from "@statewalker/workbench-views";

function optionLabel(item: PickerItem): string {
  let label = item.label;
  if (item.badge) label += ` [${item.badge.label}]`;
  if (item.description) label += ` · ${item.description}`;
  return label;
}

function renderOption(item: PickerItem) {
  return (
    <option key={item.key} value={item.key}>
      {optionLabel(item)}
    </option>
  );
}

export function PickerRenderer({ model }: { model: PickerView }) {
  useUpdates(model.onUpdate);

  const ungrouped: PickerItem[] = [];
  const sections = new Map<string, PickerItem[]>();
  for (const item of model.items) {
    if (item.section) {
      const list = sections.get(item.section) ?? [];
      list.push(item);
      sections.set(item.section, list);
    } else {
      ungrouped.push(item);
    }
  }

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
        {ungrouped.map(renderOption)}
        {[...sections.entries()].map(([section, items]) => (
          <optgroup key={section} label={section}>
            {items.map(renderOption)}
          </optgroup>
        ))}
      </select>
      {model.errorMessage && <p className="text-xs text-destructive">{model.errorMessage}</p>}
    </div>
  );
}
