import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ToggleGroupView } from "@statewalker/workbench-views";

export function ToggleGroupRenderer({ model }: { model: ToggleGroupView }) {
  useUpdates(model.onUpdate);

  return (
    <div role={model.type === "single" ? "radiogroup" : "group"} className="inline-flex gap-1">
      {model.items.map((item) => {
        const isSelected = model.selectedKeys.has(item.key);
        const isDisabled = model.isDisabled || Boolean(item.isDisabled);
        return (
          <button
            type="button"
            key={item.key}
            aria-pressed={isSelected}
            disabled={isDisabled}
            onClick={() => model.toggle(item.key)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              disabled:pointer-events-none disabled:opacity-50
              ${isSelected ? "bg-primary text-primary-foreground" : "bg-transparent border border-input hover:bg-accent hover:text-accent-foreground"}`}
          >
            {item.icon && <Icon name={item.icon} className="size-3.5" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
