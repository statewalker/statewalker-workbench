import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TabsView as TabsViewType } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function TabsRenderer({ model }: { model: TabsViewType }) {
  useUpdates(model.onUpdate);

  const activeTab = model.getActiveTab();

  return (
    <div className="w-full">
      <div className="flex border-b border-border" role="tablist">
        {model.tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === model.selectedKey}
            disabled={tab.disabled}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab.key === model.selectedKey
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            } ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => (model.selectedKey = tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4" role="tabpanel">
        {activeTab && <RenderModel model={activeTab.content} />}
      </div>
    </div>
  );
}
