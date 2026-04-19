import { TextArea } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TextAreaView } from "@statewalker/shared-views";

export function TextAreaRenderer({ model }: { model: TextAreaView }) {
  useUpdates(model.onUpdate);
  return (
    <TextArea
      label={model.label}
      value={model.value}
      placeholder={model.placeholder}
      description={model.description}
      errorMessage={model.errorMessage}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isQuiet={model.isQuiet}
      maxLength={model.maxLength}
      labelPosition={model.labelPosition}
      onChange={(v) => {
        model.value = v;
      }}
    />
  );
}
