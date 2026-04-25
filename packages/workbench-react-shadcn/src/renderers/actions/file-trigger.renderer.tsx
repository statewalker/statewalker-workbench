import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { FileTriggerView } from "@statewalker/workbench-views";
import { useRef } from "react";

export function FileTriggerRenderer({ model }: { model: FileTriggerView }) {
  useUpdates(model.onUpdate);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled={model.action.disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors"
      >
        {model.action.label ?? "Choose file"}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={model.acceptedFileTypes.join(",")}
        multiple={model.allowsMultiple}
        onChange={(e) => {
          if (e.target.files?.length) {
            model.action.submit(e.target.files);
          }
        }}
      />
    </div>
  );
}
