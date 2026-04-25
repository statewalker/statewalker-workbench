import { Breadcrumbs, Item } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { BreadcrumbView } from "@statewalker/workbench-views";

export function BreadcrumbRenderer({ model }: { model: BreadcrumbView }) {
  useUpdates(model.onUpdate);
  return (
    <Breadcrumbs
      size={model.size}
      isMultiline={model.isMultiline}
      onAction={(key) => {
        const idx = model.items.findIndex((item) => item.key === String(key));
        if (idx >= 0) {
          const item = model.items[idx]!;
          if (item.action) {
            item.action.submit();
          } else {
            model.popTo(idx);
          }
        }
      }}
    >
      {model.items.map((item) => (
        <Item key={item.key}>{item.label}</Item>
      ))}
    </Breadcrumbs>
  );
}
