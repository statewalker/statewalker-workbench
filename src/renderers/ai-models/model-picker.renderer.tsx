import { useUpdates } from "@repo/shared-react/hooks";
import type {
  ModelPickerView,
  PickerModelItem,
} from "@repo/shared-views/ai-models";

function Section({
  label,
  items,
  model,
}: {
  label: string;
  items: PickerModelItem[];
  model: ModelPickerView;
}) {
  return (
    <>
      <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled={!item.isInteractive}
          title={item.statusReason}
          className={`w-full flex items-center gap-3 px-2 py-1.5 text-sm rounded-sm transition-colors
            ${item.isInteractive ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"}
            ${item.key === model.currentKey ? "bg-accent font-medium" : ""}`}
          onClick={() => {
            if (item.isInteractive) {
              model.selectAction.submit(item.key);
              model.isOpen = false;
            }
          }}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              item.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <span className="flex-1 truncate">{item.label}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {item.provider}
          </span>
        </button>
      ))}
    </>
  );
}

export function ModelPickerRenderer({ model }: { model: ModelPickerView }) {
  useUpdates(model.onUpdate);

  const active = model.items.filter((i) => i.isActive);
  const available = model.items.filter((i) => !i.isActive);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-input
          bg-transparent px-3 py-1.5 text-sm transition-colors
          hover:bg-accent cursor-pointer"
        onClick={() => model.toggle()}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            model.isActivating
              ? "bg-yellow-400 animate-pulse"
              : model.currentKey
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
        <span className="max-w-[180px] truncate">
          {model.isActivating
            ? model.activationMessage
            : model.currentLabel || "Pick a model"}
        </span>
        <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12">
          <path
            d="M3 5l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {model.isOpen && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 min-w-[280px]
          rounded-md border border-border bg-popover p-1 shadow-md"
        >
          {active.length > 0 && (
            <Section label="Active Models" items={active} model={model} />
          )}
          {available.length > 0 && (
            <Section label="Available" items={available} model={model} />
          )}

          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            type="button"
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm
              hover:bg-accent cursor-pointer text-muted-foreground"
            onClick={() => {
              model.manageAction.submit();
              model.isOpen = false;
            }}
          >
            Manage Models...
          </button>
        </div>
      )}
    </div>
  );
}
