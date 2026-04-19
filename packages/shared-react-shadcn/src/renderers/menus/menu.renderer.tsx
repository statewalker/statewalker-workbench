import { useUpdates } from "@statewalker/shared-react/hooks";
import type { MenuView } from "@statewalker/shared-views";

export function MenuRenderer({ model }: { model: MenuView }) {
  useUpdates(model.onUpdate);

  return (
    <div
      className="min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
      role="menu"
    >
      {model.children.map((item) => {
        if (item.isSeparator) {
          return <div key={item.key} className="-mx-1 my-1 h-px bg-border" role="separator" />;
        }
        const isSelected = model.selectedKeys.has(item.key);
        const isDisabled = model.disabledKeys.has(item.key);
        return (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            disabled={isDisabled || item.action.disabled}
            onClick={() => item.action.submit()}
            className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
              hover:bg-accent hover:text-accent-foreground
              disabled:pointer-events-none disabled:opacity-50
              ${isSelected ? "bg-accent" : ""}`}
          >
            <span className="flex-1">{item.action.label ?? item.action.actionKey}</span>
            {item.shortcut && (
              <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
