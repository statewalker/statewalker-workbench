import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { RadioGroupView } from "@statewalker/workbench-views";

export function RadioGroupRenderer({ model }: { model: RadioGroupView }) {
  useUpdates(model.onUpdate);

  return (
    <fieldset disabled={model.isDisabled} className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium">
        {model.label}
        {model.isRequired && <span className="text-destructive ml-1">*</span>}
      </legend>
      <div
        className={`flex gap-3 ${model.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`}
      >
        {model.options.map((option) => (
          <label
            key={option.value}
            className={`inline-flex items-center gap-2 ${option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name={model.key}
              value={option.value}
              checked={model.value === option.value}
              disabled={option.disabled || model.isReadOnly}
              onChange={() => model.setValue(option.value)}
              className="h-4 w-4 border-input text-primary focus:ring-ring"
            />
            <div className="flex flex-col">
              <span className="text-sm">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      {model.errorMessage && <p className="text-xs text-destructive">{model.errorMessage}</p>}
    </fieldset>
  );
}
