import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ModelPickerView } from "@statewalker/shared-views/ai-models";

/**
 * Chat-header model picker. Visibility is driven by `model.mode`:
 *   "none"   → "Configure model…" button (opens settings)
 *   "single" → static label with a green dot (no popover)
 *   "multi"  → dropdown trigger + popover listing active reasoning models
 */
export function ModelPickerRenderer({ model }: { model: ModelPickerView }) {
  useUpdates(model.onUpdate);

  if (model.mode === "none") {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-input
          bg-transparent px-3 py-1.5 text-sm transition-colors
          hover:bg-accent cursor-pointer"
        onClick={() => model.manageAction.submit()}
      >
        <span className="w-2 h-2 rounded-full shrink-0 bg-gray-300 dark:bg-gray-600" />
        <span>Configure model…</span>
      </button>
    );
  }

  if (model.mode === "single") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            model.isActivating ? "bg-yellow-400 animate-pulse" : "bg-green-500"
          }`}
        />
        <span className="max-w-[220px] truncate">
          {model.isActivating ? model.activationMessage : model.currentLabel}
        </span>
      </div>
    );
  }

  // mode === "multi"
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-input
          bg-transparent px-3 py-1.5 text-sm transition-colors
          hover:bg-accent cursor-pointer"
        onClick={() => model.toggle()}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            model.isActivating ? "bg-yellow-400 animate-pulse" : "bg-green-500"
          }`}
        />
        <span className="max-w-[180px] truncate">
          {model.isActivating ? model.activationMessage : model.currentLabel || "Pick a model"}
        </span>
        <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12">
          <title>Toggle model picker</title>
          <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {model.isOpen && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 min-w-[280px]
          rounded-md border border-border bg-popover p-1 shadow-md"
        >
          {model.items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`w-full flex items-center gap-3 px-2 py-1.5 text-sm rounded-sm
                hover:bg-accent cursor-pointer transition-colors
                ${item.key === model.currentKey ? "bg-accent font-medium" : ""}`}
              onClick={() => {
                model.selectAction.submit(item.key);
                model.isOpen = false;
              }}
            >
              <span className="w-2 h-2 rounded-full shrink-0 bg-green-500" />
              <span className="flex-1 truncate">{item.label}</span>
              <span className="text-xs text-muted-foreground shrink-0">{item.provider}</span>
            </button>
          ))}

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
            Manage Models…
          </button>
        </div>
      )}
    </div>
  );
}
