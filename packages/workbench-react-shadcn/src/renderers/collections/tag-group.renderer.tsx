import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TagGroupView } from "@statewalker/workbench-views";

export function TagGroupRenderer({ model }: { model: TagGroupView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5">
      {model.label && <span className="text-sm font-medium">{model.label}</span>}
      <div className="flex flex-wrap gap-1">
        {model.items.map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium"
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
            <button
              type="button"
              onClick={() => model.removeItem(item.key)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 h-3.5 w-3.5 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              &#x2715;
            </button>
          </span>
        ))}
      </div>
      {model.errorMessage && <p className="text-xs text-destructive">{model.errorMessage}</p>}
    </div>
  );
}
