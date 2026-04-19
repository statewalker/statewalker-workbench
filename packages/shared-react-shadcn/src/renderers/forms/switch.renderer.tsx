import { useUpdates } from "@statewalker/shared-react/hooks";
import type { SwitchView } from "@statewalker/shared-views";

export function SwitchRenderer({ model }: { model: SwitchView }) {
  useUpdates(model.onUpdate);

  return (
    <label
      className={`inline-flex items-center gap-2 ${model.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={model.isSelected}
        disabled={model.isDisabled || model.isReadOnly}
        onClick={() => model.toggle()}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${model.isSelected ? (model.isEmphasized ? "bg-primary" : "bg-primary") : "bg-input"}`}
      >
        <span
          className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            model.isSelected ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm">{model.label}</span>
    </label>
  );
}
