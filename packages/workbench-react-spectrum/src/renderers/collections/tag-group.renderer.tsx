import { Item, TagGroup } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TagGroupView } from "@statewalker/workbench-views";

export function TagGroupRenderer({ model }: { model: TagGroupView }) {
  useUpdates(model.onUpdate);
  return (
    <TagGroup
      label={model.label}
      errorMessage={model.errorMessage}
      maxRows={model.maxRows}
      onRemove={(keys) => {
        for (const key of keys) {
          model.removeItem(String(key));
        }
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key}>{item.label}</Item>
      ))}
    </TagGroup>
  );
}
