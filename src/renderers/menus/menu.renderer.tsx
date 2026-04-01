import { ActionButton, Item, Menu, MenuTrigger } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { MenuView } from "@repo/shared-views";

export function MenuRenderer({ model }: { model: MenuView }) {
  useUpdates(model.onUpdate);
  return (
    <MenuTrigger>
      <ActionButton>Menu</ActionButton>
      <Menu
        selectionMode={model.selectionMode}
        selectedKeys={model.selectedKeys}
        disabledKeys={model.disabledKeys}
        onAction={(key) => {
          const item = model.children.find((c) => c.key === String(key));
          item?.action.submit();
        }}
      >
        {model.children.map((item) => (
          <Item key={item.key}>{item.action.label}</Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
