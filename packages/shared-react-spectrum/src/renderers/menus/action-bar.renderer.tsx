import { ActionBar, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ActionBarView } from "@statewalker/shared-views";

export function ActionBarRenderer({ model }: { model: ActionBarView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionBar
      isEmphasized={model.isEmphasized}
      selectedItemCount={
        model.selectedItemCount === 0 ? "all" : model.selectedItemCount
      }
      onAction={(key) => {
        const action = model.children.find((a) => a.actionKey === String(key));
        action?.submit();
      }}
      onClearSelection={() => model.setSelectedItemCount(0)}
    >
      {model.children.map((action) => (
        <Item key={action.actionKey}>{action.label}</Item>
      ))}
    </ActionBar>
  );
}
