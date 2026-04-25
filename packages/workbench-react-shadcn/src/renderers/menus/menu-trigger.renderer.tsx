import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { MenuTriggerView } from "@statewalker/workbench-views";
import { MenuRenderer } from "./menu.renderer.js";

export function MenuTriggerRenderer({ model }: { model: MenuTriggerView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => model.toggle()}
        disabled={model.trigger.disabled}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors"
      >
        {model.trigger.label ?? model.trigger.actionKey}
      </button>
      {model.isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1">
          <MenuRenderer model={model.menu} />
        </div>
      )}
    </div>
  );
}
