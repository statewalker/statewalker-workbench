import { Item, Picker } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { PickerItem, PickerView } from "@statewalker/workbench-views";

function itemLabel(item: PickerItem): string {
  let text = item.label;
  if (item.badge) text += ` [${item.badge.label}]`;
  if (item.description) text += ` · ${item.description}`;
  return text;
}

export function PickerRenderer({ model }: { model: PickerView }) {
  useUpdates(model.onUpdate);
  return (
    <Picker
      label={model.label}
      selectedKey={model.selectedKey}
      placeholder={model.placeholder}
      isDisabled={model.isDisabled}
      isRequired={model.isRequired}
      isQuiet={model.isQuiet}
      errorMessage={model.errorMessage}
      onSelectionChange={(key) => {
        model.selectedKey = String(key);
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key}>{itemLabel(item)}</Item>
      ))}
    </Picker>
  );
}
