import { Slider } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { SliderView } from "@statewalker/workbench-views";

export function SliderRenderer({ model }: { model: SliderView }) {
  useUpdates(model.onUpdate);
  return (
    <Slider
      label={model.label}
      value={model.value}
      minValue={model.minValue}
      maxValue={model.maxValue}
      step={model.step}
      isFilled={model.isFilled}
      isDisabled={model.isDisabled}
      orientation={model.orientation}
      formatOptions={model.formatOptions}
      onChange={(v) => {
        model.value = v;
      }}
    />
  );
}
