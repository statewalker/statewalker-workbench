import { useUpdates } from "@repo/shared-react/hooks";
import type { TextView } from "@repo/shared-views";

export function TextRenderer({ model }: { model: TextView }) {
  useUpdates(model.onUpdate);

  return <p className="text-sm">{model.text}</p>;
}
