import { ActionGroup, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ActionGroupView } from "@statewalker/shared-views";

export function ActionGroupRenderer({ model }: { model: ActionGroupView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionGroup
      orientation={model.orientation}
      density={model.density}
      isJustified={model.isJustified}
      isQuiet={model.isQuiet}
      isEmphasized={model.isEmphasized}
      selectionMode={model.selectionMode}
      selectedKeys={model.selectedKeys}
      disabledKeys={model.disabledKeys}
      onAction={(key) => {
        const action = model.children.find((a) => a.actionKey === String(key));
        action?.submit();
      }}
    >
      {model.children.map((action) => (
        <Item key={action.actionKey}>{action.label}</Item>
      ))}
    </ActionGroup>
  );
}
