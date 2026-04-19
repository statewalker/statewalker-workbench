import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TextFieldView } from "@statewalker/shared-views";

export function TextFieldRenderer({ model }: { model: TextFieldView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5">
      {model.label && (
        <label className="text-sm font-medium">
          {model.label}
          {model.isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        type={model.type}
        value={model.value}
        placeholder={model.placeholder}
        disabled={model.isDisabled}
        readOnly={model.isReadOnly}
        required={model.isRequired}
        maxLength={model.maxLength}
        pattern={model.pattern}
        onChange={(e) => model.setValue(e.target.value)}
        className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${model.errorMessage ? "border-destructive" : "border-input"}`}
      />
      {model.description && !model.errorMessage && (
        <p className="text-xs text-muted-foreground">{model.description}</p>
      )}
      {model.errorMessage && (
        <p className="text-xs text-destructive">{model.errorMessage}</p>
      )}
    </div>
  );
}
