import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { ListBoxView } from "@statewalker/workbench-views";

export function ListBoxRenderer({ model }: { model: ListBoxView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="overflow-auto rounded-md border border-border p-1" role="listbox">
      {model.items.map((item) => {
        const isSelected = model.selectedKeys.has(item.key);
        const isDisabled = model.disabledKeys.has(item.key);
        return (
          <div
            key={item.key}
            role="option"
            aria-selected={isSelected}
            tabIndex={model.selectionMode !== "none" ? 0 : undefined}
            onClick={() => {
              if (model.selectionMode !== "none" && !isDisabled) {
                model.toggleSelection(item.key);
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                model.selectionMode !== "none" &&
                !isDisabled
              ) {
                e.preventDefault();
                model.toggleSelection(item.key);
              }
            }}
            className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors
              ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"}
              ${isDisabled ? "opacity-50 pointer-events-none" : ""}
              ${model.selectionMode !== "none" ? "cursor-pointer" : ""}`}
          >
            {item.icon && <Icon name={item.icon} className="size-4 shrink-0" />}
            <div className="flex flex-col min-w-0">
              <span>{item.label}</span>
              {item.description && (
                <span className="text-xs text-muted-foreground">{item.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
