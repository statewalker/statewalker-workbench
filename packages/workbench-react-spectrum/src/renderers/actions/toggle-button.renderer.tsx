import { ToggleButton } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ToggleButtonView } from "@statewalker/workbench-views";

export function ToggleButtonRenderer({ model }: { model: ToggleButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <ToggleButton
      isSelected={model.isSelected}
      isEmphasized={model.isEmphasized}
      onChange={() => model.toggle()}
    >
      {model.action.label}
    </ToggleButton>
  );
}
