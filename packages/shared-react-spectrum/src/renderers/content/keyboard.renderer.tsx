import { Keyboard } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { KbdView } from "@statewalker/shared-views";

export function KeyboardRenderer({ model }: { model: KbdView }) {
  useUpdates(model.onUpdate);
  return <Keyboard>{model.keys}</Keyboard>;
}
