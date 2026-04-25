import { Switch } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { SwitchView } from "@statewalker/workbench-views";

export function SwitchRenderer({ model }: { model: SwitchView }) {
  useUpdates(model.onUpdate);
  return (
    <Switch
      isSelected={model.isSelected}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isEmphasized={model.isEmphasized}
      onChange={() => model.toggle()}
    >
      {model.label}
    </Switch>
  );
}
