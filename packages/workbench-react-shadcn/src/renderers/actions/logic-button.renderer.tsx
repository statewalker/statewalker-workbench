import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { LogicButtonView } from "@statewalker/workbench-views";
import { Button } from "../../components/index.js";

/**
 * `LogicButtonView` toggles between AND / OR. Spectrum has a dedicated
 * `LogicButton` primitive; on this side we render it as a small outline
 * button whose label reflects (and onClick toggles) the variant.
 */
export function LogicButtonRenderer({ model }: { model: LogicButtonView }) {
  useUpdates(model.onUpdate);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => model.toggle()}
      aria-pressed={model.logicVariant === "or"}
      className="font-mono uppercase"
    >
      {model.logicVariant}
    </Button>
  );
}
