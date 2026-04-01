import { Item, ListView } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ListView as ListViewType } from "@repo/shared-views";

export function ListViewRenderer({ model }: { model: ListViewType }) {
  useUpdates(model.onUpdate);
  return (
    <ListView
      selectionMode={model.selectionMode}
      selectedKeys={model.selectedKeys}
      disabledKeys={model.disabledKeys}
      density={model.density}
      overflowMode={model.overflowMode}
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
    </ListView>
  );
}
