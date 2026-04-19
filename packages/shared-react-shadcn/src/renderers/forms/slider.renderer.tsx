import { useUpdates } from "@statewalker/shared-react/hooks";
import type { SliderView } from "@statewalker/shared-views";

export function SliderRenderer({ model }: { model: SliderView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {model.label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{model.label}</span>
          <span className="text-muted-foreground">{model.value}</span>
        </div>
      )}
      <input
        type="range"
        value={model.value}
        min={model.minValue}
        max={model.maxValue}
        step={model.step}
        disabled={model.isDisabled}
        onChange={(e) => model.setValue(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
          disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
