import { ActionMenu, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ActionMenuView } from "@statewalker/shared-views";

export function ActionMenuRenderer({ model }: { model: ActionMenuView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionMenu
      isQuiet={model.isQuiet}
      isDisabled={model.action.disabled}
      onAction={(key) => {
        const item = model.items.find((i) => i.key === String(key));
        item?.action.submit();
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key}>{item.action.label}</Item>
      ))}
    </ActionMenu>
  );
}
