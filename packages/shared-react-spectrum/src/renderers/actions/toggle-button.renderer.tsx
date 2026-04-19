import { ToggleButton } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ToggleButtonView } from "@statewalker/shared-views";

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
