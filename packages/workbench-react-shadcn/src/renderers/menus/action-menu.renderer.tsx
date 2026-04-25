import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ActionMenuView } from "@statewalker/workbench-views";

export function ActionMenuRenderer({ model }: { model: ActionMenuView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => model.toggle()}
        disabled={model.action.disabled}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors
          ${model.isQuiet ? "bg-transparent hover:bg-accent" : ""}`}
      >
        {model.action.label ?? model.action.actionKey}
        <span className="ml-1">&#9662;</span>
      </button>
      {model.isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {model.items.map((item) => {
            if (item.isSeparator) {
              return <div key={item.key} className="-mx-1 my-1 h-px bg-border" role="separator" />;
            }
            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.action.disabled}
                onClick={() => {
                  item.action.submit();
                  model.setOpen(false);
                }}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="flex-1">{item.action.label ?? item.action.actionKey}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
