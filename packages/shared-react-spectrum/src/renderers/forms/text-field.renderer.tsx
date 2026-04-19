import { TextField } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TextFieldView } from "@statewalker/shared-views";

export function TextFieldRenderer({ model }: { model: TextFieldView }) {
  useUpdates(model.onUpdate);
  return (
    <TextField
      label={model.label}
      value={model.value}
      placeholder={model.placeholder}
      description={model.description}
      errorMessage={model.errorMessage}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      isQuiet={model.isQuiet}
      type={model.type}
      maxLength={model.maxLength}
      labelPosition={model.labelPosition}
      onChange={(v) => {
        model.value = v;
      }}
    />
  );
}
