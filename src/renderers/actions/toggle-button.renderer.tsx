import { useUpdates } from "@repo/shared-react/hooks";
import type { ToggleButtonView } from "@repo/shared-views";

export function ToggleButtonRenderer({ model }: { model: ToggleButtonView }) {
  useUpdates(model.onUpdate);

  return (
    <button
      type="button"
      aria-pressed={model.isSelected}
      disabled={model.action.disabled}
      onClick={() => model.toggle()}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        ${
          model.isSelected
            ? model.isEmphasized
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
            : "bg-transparent hover:bg-accent hover:text-accent-foreground"
        }
        ${model.size === "XS" ? "h-7 px-2 text-xs" : model.size === "S" ? "h-8 px-3 text-xs" : model.size === "L" ? "h-11 px-8 text-base" : model.size === "XL" ? "h-12 px-10 text-lg" : "h-9 px-4 text-sm"}`}
    >
      {model.action.label ?? model.action.actionKey}
    </button>
  );
}
