import { Item, ListBox } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ListBoxView } from "@statewalker/shared-views";

export function ListBoxRenderer({ model }: { model: ListBoxView }) {
  useUpdates(model.onUpdate);
  return (
    <ListBox
      selectionMode={model.selectionMode}
      selectedKeys={model.selectedKeys}
      disabledKeys={model.disabledKeys}
      onSelectionChange={(keys) => {
        if (keys === "all") {
          model.selectedKeys = new Set(model.items.map((i) => i.key));
        } else {
          model.selectedKeys = new Set([...keys].map(String));
        }
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key} textValue={item.label}>
          {item.label}
        </Item>
      ))}
    </ListBox>
  );
}
