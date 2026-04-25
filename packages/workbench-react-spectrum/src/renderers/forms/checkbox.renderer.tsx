import { Checkbox } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { CheckboxView } from "@statewalker/workbench-views";

export function CheckboxRenderer({ model }: { model: CheckboxView }) {
  useUpdates(model.onUpdate);
  return (
    <Checkbox
      isSelected={model.isSelected}
      isIndeterminate={model.isIndeterminate}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isRequired={model.isRequired}
      isEmphasized={model.isEmphasized}
      onChange={() => model.toggle()}
    >
      {model.label}
    </Checkbox>
  );
}
