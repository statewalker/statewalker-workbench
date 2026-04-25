import { Item, Picker } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { PickerView } from "@statewalker/workbench-views";

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
        <Item key={item.key}>{item.label}</Item>
      ))}
    </Picker>
  );
}
