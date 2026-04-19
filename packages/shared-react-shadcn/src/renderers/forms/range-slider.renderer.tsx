import { useUpdates } from "@statewalker/shared-react/hooks";
import type { RangeSliderView } from "@statewalker/shared-views";

export function RangeSliderRenderer({ model }: { model: RangeSliderView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {model.label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{model.label}</span>
          <span className="text-muted-foreground">
            {model.startValue} - {model.endValue}
          </span>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="range"
          value={model.startValue}
          min={model.minValue}
          max={model.maxValue}
          step={model.step}
          disabled={model.isDisabled}
          onChange={(e) =>
            model.setRange(Number(e.target.value), model.endValue)
          }
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
            disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          type="range"
          value={model.endValue}
          min={model.minValue}
          max={model.maxValue}
          step={model.step}
          disabled={model.isDisabled}
          onChange={(e) =>
            model.setRange(model.startValue, Number(e.target.value))
          }
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
            disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
