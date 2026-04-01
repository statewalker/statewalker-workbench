import { Keyboard } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { KbdView } from "@repo/shared-views";

export function KeyboardRenderer({ model }: { model: KbdView }) {
  useUpdates(model.onUpdate);
  return <Keyboard>{model.keys}</Keyboard>;
}
