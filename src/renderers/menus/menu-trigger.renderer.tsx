import { ActionButton, Item, Menu, MenuTrigger } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { MenuTriggerView } from "@repo/shared-views";

export function MenuTriggerRenderer({ model }: { model: MenuTriggerView }) {
  useUpdates(model.onUpdate);
  return (
    <MenuTrigger
      isOpen={model.isOpen}
      onOpenChange={(open) => model.setOpen(open)}
    >
      <ActionButton onPress={() => model.toggle()}>
        {model.trigger.label}
      </ActionButton>
      <Menu
        selectionMode={model.menu.selectionMode}
        selectedKeys={model.menu.selectedKeys}
        disabledKeys={model.menu.disabledKeys}
        onAction={(key) => {
          const item = model.menu.children.find((c) => c.key === String(key));
          item?.action.submit();
        }}
      >
        {model.menu.children.map((item) => (
          <Item key={item.key}>{item.action.label}</Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
