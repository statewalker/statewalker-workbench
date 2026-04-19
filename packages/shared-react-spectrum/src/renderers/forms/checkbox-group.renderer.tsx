import { Checkbox, CheckboxGroup } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { CheckboxGroupView } from "@statewalker/shared-views";

export function CheckboxGroupRenderer({ model }: { model: CheckboxGroupView }) {
  useUpdates(model.onUpdate);
  return (
    <CheckboxGroup
      label={model.label}
      value={model.value}
      orientation={model.orientation}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      errorMessage={model.errorMessage}
      onChange={(v) => {
        model.value = v;
      }}
    >
      {model.children.map((child) => (
        <Checkbox key={child.key} value={child.key}>
          {child.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
