import { Radio, RadioGroup } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { RadioGroupView } from "@statewalker/shared-views";

export function RadioGroupRenderer({ model }: { model: RadioGroupView }) {
  useUpdates(model.onUpdate);
  return (
    <RadioGroup
      label={model.label}
      value={model.value ?? ""}
      orientation={model.orientation}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      errorMessage={model.errorMessage}
      onChange={(v) => {
        model.value = v;
      }}
    >
      {model.options.map((opt) => (
        <Radio key={opt.value} value={opt.value} isDisabled={opt.disabled}>
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
