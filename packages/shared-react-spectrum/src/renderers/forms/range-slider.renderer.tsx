import { RangeSlider } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { RangeSliderView } from "@statewalker/shared-views";

export function RangeSliderRenderer({ model }: { model: RangeSliderView }) {
  useUpdates(model.onUpdate);
  return (
    <RangeSlider
      label={model.label}
      value={{ start: model.startValue, end: model.endValue }}
      minValue={model.minValue}
      maxValue={model.maxValue}
      step={model.step}
      isDisabled={model.isDisabled}
      onChange={(v) => {
        model.setRange(v.start, v.end);
      }}
    />
  );
}
