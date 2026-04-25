import { Keyboard } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { KbdView } from "@statewalker/workbench-views";

export function KeyboardRenderer({ model }: { model: KbdView }) {
  useUpdates(model.onUpdate);
  return <Keyboard>{model.keys}</Keyboard>;
}
