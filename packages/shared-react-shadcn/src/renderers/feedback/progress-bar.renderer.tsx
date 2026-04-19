import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ProgressBarView } from "@statewalker/shared-views";

export function ProgressBarRenderer({ model }: { model: ProgressBarView }) {
  useUpdates(model.onUpdate);

  const heightClass = model.size === "S" ? "h-1" : model.size === "L" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      {(model.label || model.showValueLabel) && (
        <div className="flex justify-between mb-1 text-sm">
          {model.label && <span className="text-muted-foreground">{model.label}</span>}
          {model.showValueLabel && !model.isIndeterminate && (
            <span className="text-muted-foreground">{Math.round(model.percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full bg-secondary ${heightClass} overflow-hidden`}>
        {model.isIndeterminate ? (
          <div className={`${heightClass} rounded-full bg-primary animate-pulse w-1/2`} />
        ) : (
          <div
            className={`${heightClass} rounded-full bg-primary transition-[width] duration-200`}
            style={{
              width: `${Math.min(100, Math.max(0, model.percentage))}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
