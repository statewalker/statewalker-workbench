import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ListView } from "@statewalker/workbench-views";

const densityPadding: Record<string, string> = {
  compact: "px-2 py-1",
  regular: "px-3 py-2",
  spacious: "px-4 py-3",
};

export function ListViewRenderer({ model }: { model: ListView }) {
  useUpdates(model.onUpdate);

  const padding = densityPadding[model.density] ?? densityPadding.regular;

  return (
    <ul className="overflow-auto rounded-md border border-border">
      {model.items.map((item) => {
        const isSelected = model.selectedKeys.has(item.key);
        const isDisabled = model.disabledKeys.has(item.key);
        return (
          <li
            key={item.key}
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
            className={`flex items-center gap-3 border-b border-border last:border-b-0 ${padding} text-sm transition-colors
              ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"}
              ${isDisabled ? "opacity-50 pointer-events-none" : ""}
              ${model.selectionMode !== "none" ? "cursor-pointer" : ""}`}
          >
            {item.icon && <span>{item.icon}</span>}
            <div className="flex flex-col min-w-0">
              <span className={model.overflowMode === "truncate" ? "truncate" : ""}>
                {item.label}
              </span>
              {item.description && (
                <span className="text-xs text-muted-foreground">{item.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
