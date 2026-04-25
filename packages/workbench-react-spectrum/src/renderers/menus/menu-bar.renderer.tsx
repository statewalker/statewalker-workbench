import { Flex } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { MenuBarView } from "@statewalker/workbench-views";
import { MenuTriggerRenderer } from "./menu-trigger.renderer.js";

export function MenuBarRenderer({ model }: { model: MenuBarView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex direction="row" gap="size-0">
      {model.children.map((trigger) => (
        <MenuTriggerRenderer key={trigger.key} model={trigger} />
      ))}
    </Flex>
  );
}
