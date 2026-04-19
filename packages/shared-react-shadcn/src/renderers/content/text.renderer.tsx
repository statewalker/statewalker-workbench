import { useUpdates } from "@statewalker/shared-react/hooks";
import type { TextView } from "@statewalker/shared-views";

export function TextRenderer({ model }: { model: TextView }) {
  useUpdates(model.onUpdate);

  return <p className="text-sm">{model.text}</p>;
}
