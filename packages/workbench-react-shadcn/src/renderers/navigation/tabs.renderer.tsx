import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { TabsView as TabsViewType } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function TabsRenderer({ model }: { model: TabsViewType }) {
  useUpdates(model.onUpdate);

  const activeTab = model.getActiveTab();

  return (
    <div className="w-full">
      <div
        className="inline-flex items-center gap-1 bg-muted p-1 rounded-md"
        role="tablist"
      >
        {model.tabs.map((tab) => {
          const isActive = tab.key === model.selectedKey;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                model.selectedKey = tab.key;
              }}
            >
              {tab.icon && <Icon name={tab.icon} className="size-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4" role="tabpanel">
        {activeTab && <RenderModel model={activeTab.content} />}
      </div>
    </div>
  );
}
