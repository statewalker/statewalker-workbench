import { Button, FileTrigger } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { FileTriggerView } from "@repo/shared-views";

export function FileTriggerRenderer({ model }: { model: FileTriggerView }) {
  useUpdates(model.onUpdate);
  return (
    <FileTrigger
      acceptedFileTypes={model.acceptedFileTypes}
      allowsMultiple={model.allowsMultiple}
    >
      <Button>{model.action.label}</Button>
    </FileTrigger>
  );
}
