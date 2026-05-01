import { ActionGroup, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ToggleGroupView } from "@statewalker/workbench-views";

export function ToggleGroupRenderer({ model }: { model: ToggleGroupView }) {
  useUpdates(model.onUpdate);
  return (
    <ActionGroup
      selectionMode={model.type}
      selectedKeys={model.selectedKeys}
      isDisabled={model.isDisabled}
      onSelectionChange={(keys) => {
        if (keys === "all") {
          model.setSelected(model.items.map((i) => i.key));
        } else {
          model.setSelected([...keys].map(String));
        }
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key} textValue={item.label ?? item.key}>
          {item.icon && <Icon name={item.icon} className="w-[14px] h-[14px] mr-1" />}
          {item.label}
        </Item>
      ))}
    </ActionGroup>
  );
}
