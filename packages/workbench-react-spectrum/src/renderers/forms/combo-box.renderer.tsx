import { ComboBox, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ComboBoxView } from "@statewalker/workbench-views";

export function ComboBoxRenderer({ model }: { model: ComboBoxView }) {
  useUpdates(model.onUpdate);
  return (
    <ComboBox
      label={model.label}
      selectedKey={model.selectedKey}
      inputValue={model.inputValue}
      placeholder={model.placeholder}
      isDisabled={model.isDisabled}
      isRequired={model.isRequired}
      isQuiet={model.isQuiet}
      errorMessage={model.errorMessage}
      allowsCustomValue={model.allowsCustomValue}
      menuTrigger={model.menuTrigger}
      onSelectionChange={(key) => {
        model.selectedKey = key != null ? String(key) : undefined;
      }}
      onInputChange={(v) => {
        model.inputValue = v;
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key}>{item.label}</Item>
      ))}
    </ComboBox>
  );
}
