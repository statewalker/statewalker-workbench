import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TextView } from "@statewalker/workbench-views";

export function TextRenderer({ model }: { model: TextView }) {
  useUpdates(model.onUpdate);

  return <p className="text-sm">{model.text}</p>;
}
