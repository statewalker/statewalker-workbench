import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ComboBoxView } from "@statewalker/shared-views";
import { useState } from "react";

export function ComboBoxRenderer({ model }: { model: ComboBoxView }) {
  useUpdates(model.onUpdate);
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = model.items.filter((item) =>
    item.label.toLowerCase().includes(model.inputValue.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-1.5 relative">
      {model.label && (
        <label className="text-sm font-medium">
          {model.label}
          {model.isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        type="text"
        value={model.inputValue}
        placeholder={model.placeholder}
        disabled={model.isDisabled}
        onChange={(e) => {
          model.setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (model.menuTrigger === "focus") setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${model.errorMessage ? "border-destructive" : "border-input"}`}
      />
      {isOpen && filteredItems.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {filteredItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  model.selectedKey === item.key ? "bg-accent" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  model.setSelectedKey(item.key);
                  model.setInputValue(item.label);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {model.errorMessage && (
        <p className="text-xs text-destructive">{model.errorMessage}</p>
      )}
    </div>
  );
}
