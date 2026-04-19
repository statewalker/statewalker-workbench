import { useUpdates } from "@statewalker/shared-react/hooks";
import type { MeterView } from "@statewalker/shared-views";

const variantColors: Record<string, string> = {
  positive: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  informative: "bg-blue-500",
};

export function MeterRenderer({ model }: { model: MeterView }) {
  useUpdates(model.onUpdate);

  const heightClass = model.size === "S" ? "h-1" : model.size === "L" ? "h-3" : "h-2";
  const barColor = variantColors[model.variant] ?? "bg-primary";

  return (
    <div className="w-full">
      {model.label && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-muted-foreground">{model.label}</span>
          <span className="text-muted-foreground">{Math.round(model.percentage)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-secondary ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} rounded-full ${barColor} transition-[width] duration-200`}
          style={{
            width: `${Math.min(100, Math.max(0, model.percentage))}%`,
          }}
        />
      </div>
    </div>
  );
}
