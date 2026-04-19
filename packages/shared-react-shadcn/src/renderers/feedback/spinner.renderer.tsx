import { useUpdates } from "@statewalker/shared-react/hooks";
import type { SpinnerView } from "@statewalker/shared-views";

const sizeClasses: Record<string, string> = {
  S: "w-4 h-4 border-2",
  M: "w-6 h-6 border-2",
  L: "w-10 h-10 border-3",
};

export function SpinnerRenderer({ model }: { model: SpinnerView }) {
  useUpdates(model.onUpdate);

  const sizeClass = sizeClasses[model.size] ?? sizeClasses.M;

  return (
    <output className="inline-flex flex-col items-center gap-2">
      <div
        className={`animate-spin rounded-full border-current border-t-transparent ${sizeClass}`}
      />
      {model.label && <span className="text-sm text-muted-foreground">{model.label}</span>}
    </output>
  );
}
