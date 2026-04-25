import { Button, FileTrigger } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { FileTriggerView } from "@statewalker/workbench-views";

export function FileTriggerRenderer({ model }: { model: FileTriggerView }) {
  useUpdates(model.onUpdate);
  return (
    <FileTrigger acceptedFileTypes={model.acceptedFileTypes} allowsMultiple={model.allowsMultiple}>
      <Button variant="primary">{model.action.label}</Button>
    </FileTrigger>
  );
}
