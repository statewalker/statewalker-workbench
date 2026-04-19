import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ButtonView } from "@statewalker/shared-views";

export function ButtonRenderer({ model }: { model: ButtonView }) {
  useUpdates(model.onUpdate);

  return (
    <button
      type={model.type}
      disabled={model.action.disabled || model.isPending}
      onClick={() => model.action.submit()}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        bg-primary text-primary-foreground hover:bg-primary/90
        ${model.size === "S" ? "h-8 px-3 text-xs" : model.size === "L" ? "h-11 px-8 text-base" : model.size === "XL" ? "h-12 px-10 text-lg" : "h-9 px-4 text-sm"}`}
    >
      {model.isPending && (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {model.action.label ?? model.action.actionKey}
    </button>
  );
}
