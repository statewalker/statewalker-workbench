import { Switch } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { SwitchView } from "@repo/shared-views";

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
