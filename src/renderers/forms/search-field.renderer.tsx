import { SearchField } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { SearchFieldView } from "@repo/shared-views";

export function SearchFieldRenderer({ model }: { model: SearchFieldView }) {
  useUpdates(model.onUpdate);
  return (
    <SearchField
      label={model.label}
      value={model.value}
      placeholder={model.placeholder}
      isDisabled={model.isDisabled}
      isQuiet={model.isQuiet}
      onChange={(v) => {
        model.value = v;
      }}
      onClear={() => model.clear()}
    />
  );
}
