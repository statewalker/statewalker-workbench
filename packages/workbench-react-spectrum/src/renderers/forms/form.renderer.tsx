import { Form } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { FormView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function FormRenderer({ model }: { model: FormView }) {
  useUpdates(model.onUpdate);
  return (
    <Form
      labelPosition={model.labelPosition}
      labelAlign={model.labelAlign}
      isRequired={model.isRequired}
      isDisabled={model.isDisabled}
      isReadOnly={model.isReadOnly}
      validationBehavior={model.validationBehavior}
      necessityIndicator={model.necessityIndicator}
    >
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Form>
  );
}
