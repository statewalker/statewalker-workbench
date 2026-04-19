import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TextAreaView } from "@statewalker/shared-views";

export function TextAreaRenderer({ model }: { model: TextAreaView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5">
      {model.label && (
        <label className="text-sm font-medium">
          {model.label}
          {model.isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <textarea
        value={model.value}
        placeholder={model.placeholder}
        disabled={model.isDisabled}
        readOnly={model.isReadOnly}
        required={model.isRequired}
        maxLength={model.maxLength}
        onChange={(e) => model.setValue(e.target.value)}
        className={`flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${model.errorMessage ? "border-destructive" : "border-input"}`}
      />
      {model.description && !model.errorMessage && (
        <p className="text-xs text-muted-foreground">{model.description}</p>
      )}
      {model.errorMessage && <p className="text-xs text-destructive">{model.errorMessage}</p>}
    </div>
  );
}
