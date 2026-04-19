import { Link } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { LinkView } from "@statewalker/shared-views";

export function LinkRenderer({ model }: { model: LinkView }) {
  useUpdates(model.onUpdate);
  return (
    <Link
      variant={model.variant}
      isQuiet={model.isQuiet}
      onPress={() => model.action.submit()}
    >
      {model.action.label}
    </Link>
  );
}
