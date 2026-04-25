import { Link } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { LinkView } from "@statewalker/workbench-views";

export function LinkRenderer({ model }: { model: LinkView }) {
  useUpdates(model.onUpdate);
  return (
    <Link variant={model.variant} isQuiet={model.isQuiet} onPress={() => model.action.submit()}>
      {model.action.label}
    </Link>
  );
}
